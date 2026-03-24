let map;
let userLocation = null;// Actual GPS location
let activeRoute = null;
let campusBounds = null;
let CAMPUS_GRAPH = new Map();// Graph for shortest path
let markers = [];// for cleanup
let currentDept = null;
const HOVER_IMAGE_CACHE = new Map();

const SNAP_DISTANCE = 6;// meters (connect nearby route points)
const GATE_SNAP_MAX_METERS = 99999999; // snap to gate only if within this range (adjust)

/* ===== Gates ===== */
const GATES = {
  frontGate: { lat: 15.3218841, lng: 119.9852327 },
  backGate: { lat: 15.3166213, lng: 119.9833767 },
  //prmsuArc: { lat: 15.3218841, lng: 119.9852327 }
};

/* ===== Graph Utilities ===== */
function coordKey(pt) {
  return `${pt.lat},${pt.lng}`;
}

function distanceMeters(a, b) {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(a),
    new google.maps.LatLng(b)
  );
}

function addEdge(a, b, weightMultiplier = 1) {
  const keyA = coordKey(a);
  const keyB = coordKey(b);

  const dist = distanceMeters(a, b) * weightMultiplier;

  if (!CAMPUS_GRAPH.has(keyA)) CAMPUS_GRAPH.set(keyA, []);
  if (!CAMPUS_GRAPH.has(keyB)) CAMPUS_GRAPH.set(keyB, []);

  CAMPUS_GRAPH.get(keyA).push({ node: keyB, weight: dist });
  CAMPUS_GRAPH.get(keyB).push({ node: keyA, weight: dist });
}

function keyToPoint(key) {
  const [lat, lng] = key.split(",").map(Number);
  return { lat, lng };
}

function getConnectedComponents(graph) {
  const visited = new Set();
  const comps = [];

  for (const node of graph.keys()) {
    if (visited.has(node)) continue;

    const stack = [node];
    const comp = [];
    visited.add(node);

    while (stack.length) {
      const cur = stack.pop();
      comp.push(cur);

      for (const { node: nxt } of (graph.get(cur) || [])) {
        if (!visited.has(nxt)) {
          visited.add(nxt);
          stack.push(nxt);
        }
      }
    }

    comps.push(comp);
  }

  return comps;
}

function connectClosestComponentsWithPenalty(compA, compB, penaltyMultiplier = 4) {
  let bestAKey = null, bestBKey = null;
  let bestD = Infinity;

  for (const keyA of compA) {
    const a = keyToPoint(keyA);
    for (const keyB of compB) {
      const b = keyToPoint(keyB);
      const d = distanceMeters(a, b);

      if (d < bestD) {
        bestD = d;
        bestAKey = keyA;
        bestBKey = keyB;
      }
    }
  }

  if (!bestAKey || !bestBKey) return;

  const bestA = keyToPoint(bestAKey);
  const bestB = keyToPoint(bestBKey);

  // pagdikitin edge
  addEdge(bestA, bestB, penaltyMultiplier);
}


/* ===== Gate-only snap ===== */
function getNearestGate(loc) {
  const gates = [GATES.frontGate, GATES.backGate];

  let nearest = gates[0];
  let minDist = distanceMeters(loc, nearest);

  for (const gate of gates) {
    const d = distanceMeters(loc, gate);
    if (d < minDist) {
      minDist = d;
      nearest = gate;
    }
  }
  return nearest;
}

function snapUserToGateOnly(loc) {
  const gate = getNearestGate(loc);
  const dist = distanceMeters(loc, gate);

  return {
    snapped: gate,     // ✅ start point is literally the gate
    didSnap: true,
    gate,
    dist
  };
}



/* ===== Path Simplify (safe) ===== */
function simplifyPath(path, tolerance = 1.5) {
  if (!path || path.length < 3) return path || [];

  const simplified = [path[0]];

  for (let i = 1; i < path.length - 1; i++) {
    const prev = simplified[simplified.length - 1];
    const curr = path[i];
    const next = path[i + 1];

    const d1 = distanceMeters(prev, curr);
    const d2 = distanceMeters(curr, next);
    const d3 = distanceMeters(prev, next);

    if (Math.abs((d1 + d2) - d3) > tolerance) {
      simplified.push(curr);
    }
  }

  simplified.push(path[path.length - 1]);
  return simplified;
}

/* ===== Build Graph ===== */
function buildCampusGraph() {
  CAMPUS_GRAPH.clear();

  const allPoints = [];

  // normal edges
  ADDITIONAL_ROUTES.forEach(route => {
    for (let i = 0; i < route.length - 1; i++) {
      addEdge(route[i], route[i + 1]);
      allPoints.push(route[i]);
    }
    allPoints.push(route[route.length - 1]);
  });

  // auto-connect nearby points
  for (let i = 0; i < allPoints.length; i++) {
    for (let j = i + 1; j < allPoints.length; j++) {
      if (distanceMeters(allPoints[i], allPoints[j]) <= SNAP_DISTANCE) {
        addEdge(allPoints[i], allPoints[j]);
      }
    }
  }

  // but make bridges "expensive" so the route stays rational.
  const BRIDGE_PENALTY = 6; // tune 2–6 (higher = less likely to use bridges)

  let comps = getConnectedComponents(CAMPUS_GRAPH);

  while (comps.length > 1) {
    // Connect component 0 to the closest other component (component 1)
    connectClosestComponentsWithPenalty(comps[0], comps[1], BRIDGE_PENALTY);
    comps = getConnectedComponents(CAMPUS_GRAPH);
  }

}

function getConnectedComponents(graph) {
  const visited = new Set();
  const comps = [];

  for (const node of graph.keys()) {
    if (visited.has(node)) continue;

    const stack = [node];
    const comp = [];
    visited.add(node);

    while (stack.length) {
      const cur = stack.pop();
      comp.push(cur);

      for (const { node: nxt } of (graph.get(cur) || [])) {
        if (!visited.has(nxt)) {
          visited.add(nxt);
          stack.push(nxt);
        }
      }
    }
    comps.push(comp);
  }
  return comps;
}

function connectTwoComponents(compA, compB) {
  // Connect closest pair of nodes between components
  let bestA = null, bestB = null, bestD = Infinity;

  for (const keyA of compA) {
    const a = keyToPoint(keyA);
    for (const keyB of compB) {
      const b = keyToPoint(keyB);
      const d = distanceMeters(a, b);
      if (d < bestD) {
        bestD = d;
        bestA = a;
        bestB = b;
      }
    }
  }

  if (bestA && bestB) addEdge(bestA, bestB);
}

function keyToPoint(key) {
  const [lat, lng] = key.split(",").map(Number);
  return { lat, lng };
}

/* =====  (Dijkstra) ===== */
function shortestPath(graph, startKey, endKey) {
  const dist = {};
  const prev = {};
  const pq = [];

  graph.forEach((_, key) => (dist[key] = Infinity));
  dist[startKey] = 0;
  pq.push({ key: startKey, d: 0 });

  while (pq.length) {
    pq.sort((a, b) => a.d - b.d);
    const { key } = pq.shift();

    if (key === endKey) break;

    const neighbors = graph.get(key) || [];
    for (const n of neighbors) {
      const alt = dist[key] + n.weight;
      if (alt < dist[n.node]) {
        dist[n.node] = alt;
        prev[n.node] = key;
        pq.push({ key: n.node, d: alt });
      }
    }
  }

  const path = [];
  let curr = endKey;

  while (curr) {
    const [lat, lng] = curr.split(",").map(Number);
    path.unshift({ lat, lng });
    curr = prev[curr];
  }

  return path;
}

/* ===== Snap to route points ===== */
function getNearestRoutePoint(loc) {
  let nearest = null;
  let minDist = Infinity;

  ADDITIONAL_ROUTES.forEach(route => {
    route.forEach(pt => {
      const d = distanceMeters(loc, pt);
      if (d < minDist) {
        minDist = d;
        nearest = pt;
      }
    });
  });

  return nearest;
}

/* ===== Route Drawing ===== */
let dashAnimTimer = null;

function drawArrowRoute(pathCoords) {
  if (window.routeLine) window.routeLine.setMap(null);
  if (dashAnimTimer) clearInterval(dashAnimTimer);

  const arrowSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 3,                 // size of arrow
    strokeColor: "#4169E1",   // gold
    strokeWeight: 5,
    fillColor: "#4169E1",
    fillOpacity: 1
  };

  window.routeLine = new google.maps.Polyline({
    path: pathCoords,
    strokeColor: "#4169E1",  // base line color pero tinanggal q kse baduy
    strokeWeight: 12,
    strokeOpacity: 0.7,
    geodesic: true,
    icons: [{
      icon: arrowSymbol,
      offset: "0%",
      repeat: "30px"        // space between arrows
    }],
    zIndex: 2
  });

  window.routeLine.setMap(map);

  //Smooth + slow animation
  let offset = 0;
  const step = 0.2;
  const frame = 12;

  dashAnimTimer = setInterval(() => {
    offset = (offset + 1) % 100;
    window.routeLine.setOptions({
      icons: [{
        icon: arrowSymbol,
        offset: offset + "%",
        repeat: "30px"
      }]
    });
  }, 100);
}
//
function drawCampusRoute(path) {
  if (activeRoute) activeRoute.setMap(null);
  if (window.routeLine) window.routeLine.setMap(null);
  if (dashAnimTimer) clearInterval(dashAnimTimer);

  if (!path || path.length < 2) return;

  const coords = path;

  drawArrowRoute(coords);
  activeRoute = window.routeLine;

  // Keep your auto-zoom logic
  const bounds = new google.maps.LatLngBounds();
  coords.forEach(pt => bounds.extend(pt));
  map.fitBounds(bounds);
}


/* ===== Directions: GATE-only snap origin ===== */
function getDirectionsToDept(dept) { 
  if (!userLocation) {
    alert("User location not detected");
    return;
  }

  // auto fill dir
  const toInput = document.getElementById("toInput");
  if (toInput) toInput.value = dept.title;

  // ✅ 1) Start from user (snap to nearest route point)
  let startPt = getNearestRoutePoint(userLocation);

  // ✅ 2) If user is too far from any route, fallback to nearest gate
  const distToRoute = startPt ? distanceMeters(userLocation, startPt) : Infinity;

  let routingOrigin = userLocation; // default: real GPS

  if (distToRoute > 35) {
    const { snapped: gatePoint } = snapUserToGateOnly(userLocation);
    routingOrigin = gatePoint; // ✅ ONLY for routing
  }

  // ✅ Snap the ROUTING origin to a route node
  startPt = getNearestRoutePoint(routingOrigin);

  // ✅ Keep marker always following real GPS (create if missing)
  if (!window.userMarker) {
    window.userMarker = new google.maps.Marker({
      position: userLocation,
      map,
      title: "You are here",
      icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });
  } else {
    window.userMarker.setPosition(userLocation);
  }

  // ✅ End node = nearest route point to destination
  const endPt = getNearestRoutePoint(dept.position);

  if (!startPt || !endPt) {
    console.error("Unable to snap points to routes");
    return;
  }

  const path = shortestPath(CAMPUS_GRAPH, coordKey(startPt), coordKey(endPt));
  drawCampusRoute(path);

  closeDeptPanel();

  const steps = buildTurnByTurn(
    path,
    document.getElementById("toInput")?.value || dept.title
  );
  LIVE_STEPS = steps;
  LIVE_DEST_NAME = dept.title;
  renderDirectionsSteps(steps);

  const dir = document.getElementById("dirPanel");
if (dir) {
  dir.classList.add("open");
  document.body.classList.add("dir-open");
  document.body.classList.remove("dir-closing");
}

  NAV_ACTIVE = true;
  NAV_DEST = dept; // or dept.position if you prefer

  startLiveNavigation(dept);

}

let hoverInfoWindow;

//pre load
function preloadHoverImages() {
  locations.forEach(loc => {
    if (!loc.image) return;

    const img = new Image();
    img.src = loc.image;
    img.loading = "eager";
    img.decoding = "sync";

    HOVER_IMAGE_CACHE.set(loc.title, img);

    if (img.decode) {
      img.decode().catch(() => {});
    }
  });
}

/* ===== Initialize Map ===== */
function initMap() {
  campusBounds = new google.maps.LatLngBounds(
    { lat: 15.3163, lng: 119.9812 },
    { lat: 15.3230, lng: 119.9859 }
  );
  const DESIRED_MAX_ZOOM = 20;

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 15.3305, lng: 119.9846 },
    zoom: DESIRED_MAX_ZOOM,
    maxZoom: DESIRED_MAX_ZOOM,
    mapId: "fed2c6c31b0e103f3ad2dea0",
    mapTypeId: "hybrid",
    tilt: 45,
    restriction: { latLngBounds: campusBounds, strictBounds: true },
    styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT,
      mapTypeIds: ["roadmap", "satellite", "terrain"]
    }
  });

  map.addListener("click", () => {
  if (isTouchDevice()) {
    hideMarkerHover();
  }
});

  //newww
  window.map = map;

  map.fitBounds(campusBounds);
  drawCampusPaths();
  buildCampusGraph();

  initOffscreenArrow();
  initBuildingPolygons();

google.maps.event.addListenerOnce(map, "idle", () => {
  initProjectionHelper();

  // run once after projection becomes available
  updateOffscreenArrow();
});

// Fit the campus bounds (this sets the correct "max zoom-out")
map.fitBounds(campusBounds);
map.setTilt(45);

//zoom slider setup
const zoomSlider = document.getElementById("zoomSlider");

// Slider is PERCENT, not zoom
zoomSlider.min = 0;
zoomSlider.max = 100;
zoomSlider.step = 0.1;

let MIN_ZOOM;                 // will be computed from fitBounds
const MAX_ZOOM = DESIRED_MAX_ZOOM;

// --- helper ---
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function zoomToPct(z) {
  return ((z - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100;
}

function pctToZoom(p) {
  return MIN_ZOOM + (p / 100) * (MAX_ZOOM - MIN_ZOOM);
}

// Smoothly animate native thumb to target pct (so yellow circle moves smoothly)
let animToken = 0;
function animateSliderTo(targetPct, ms = 160) {
  const start = Number(zoomSlider.value) || 0;
  const end = clamp(targetPct, 0, 100);
  const t0 = performance.now();
  const myToken = ++animToken;

  const tick = (t) => {
    if (myToken !== animToken) return; // cancel previous animation
    const k = clamp((t - t0) / ms, 0, 1);
    const eased = 1 - Math.pow(1 - k, 3); // ease-out

    const v = start + (end - start) * eased;
    zoomSlider.value = v;

    if (k < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

// After fitBounds finishes, lock that zoom as the MIN_ZOOM (your max zoom-out)
google.maps.event.addListenerOnce(map, "idle", () => {
  MIN_ZOOM = map.getZoom(); // ✅ campus-wide zoom out

  // lock map zoom limits
  map.setOptions({ minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM });
  //map.setTilt(45); // optional, comment out if you hate tilt
  // init slider position from current zoom
  const pct = zoomToPct(map.getZoom());
  zoomSlider.value = clamp(pct, 0, 100);
});

// Slider -> Map (dragging)
zoomSlider.addEventListener("input", () => {
  if (MIN_ZOOM == null) return;

  const pct = Number(zoomSlider.value);
  const desiredZoom = pctToZoom(pct);

  // map zoom is integer, so round
  map.setZoom(desiredZoom);

});

let dragging = false;

zoomSlider.addEventListener("mousedown", () => dragging = true);
zoomSlider.addEventListener("touchstart", () => dragging = true, { passive: true });

window.addEventListener("mouseup", () => dragging = false);
window.addEventListener("touchend", () => dragging = false, { passive: true });


// Map -> Slider (wheel/pinch)
map.addListener("zoom_changed", () => {
  if (MIN_ZOOM == null) return;
  if (dragging) return;

  const z = clamp(map.getZoom(), MIN_ZOOM, MAX_ZOOM);
  animateSliderTo(zoomToPct(z), 160);
});



  hoverInfoWindow = new google.maps.InfoWindow({
  disableAutoPan: true,
  pixelOffset: new google.maps.Size(0, -10)
});

preloadHoverImages();

  // markers
  locations.forEach(loc => {
  const marker = new google.maps.Marker({
    position: loc.position,
    map: null,
    title: loc.title,
    icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new google.maps.Size(46, 46), // adjust
          anchor: new google.maps.Point(18, 36),     // bottom-center
          labelOrigin: new google.maps.Point(46, 55) // top-center for label
          },
    label: {
    text: loc.title,
    className: "marker-label",
    //color: "#e3e3e3",
    //fontSize: "12px",
    //fontWeight: "600",
    //fontFamily: "system-ui"
    }

  });
  markers.push(marker);

  // desktop hover
marker.addListener("mouseover", () => {
  showMarkerHover(loc, marker);
});

marker.addListener("mouseout", () => {
  if (!isTouchDevice()) {
    hideMarkerHover();
  }
});

// mobile + desktop tap/click
marker.addListener("click", () => {
  // on touch devices: first tap = hover, second tap = open panel
  if (isTouchDevice()) {
    if (ACTIVE_HOVER_TITLE !== loc.title) {
      showMarkerHover(loc, marker);
      return;
    }
  }

  closeSideMenu();
  closeDirectionPanel();
  openDeptPanel(loc);
});
  loc.marker = marker;
  
});

  setupSearchPanel(map, locations);
  setupLocationPrePrompt();
  

}

/* ===== Draw Campus Paths ===== */
function drawCampusPaths() {
  // draw each route (ADDITIONAL_ROUTES is array of arrays)
  ADDITIONAL_ROUTES.forEach(route => {
    new google.maps.Polyline({
      path: route,
      map: map,
      strokeColor: " #4169E1",
      strokeWeight: 15,
      strokeOpacity: 0.1
    });
  });
}

/* ===== Get User Location ===== */
let hasAutoCentered = false;

function getUserLocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported");

  navigator.geolocation.watchPosition(
    (pos) => {
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };

      updateOffscreenArrow();

      // Create glow circle once
  if (!window.userGlow) {
    window.userGlow = new google.maps.Circle({
      map: map,
      center: userLocation,
      radius: 10, // meters
      strokeColor: "#1e90ff",
      strokeOpacity: 0,
      fillColor: "#1e90ff",
      fillOpacity: 0.25,
      zIndex: 1
    });
} else {
window.userGlow.setCenter(userLocation);
}

      const debug = document.getElementById("debugGPS");
if (debug) {
  debug.textContent =
    `Lat: ${userLocation.lat.toFixed(6)}
Lng: ${userLocation.lng.toFixed(6)}`;
}


      // startpos
      const fromInput = document.getElementById("fromInput");
      if (fromInput) {
        fromInput.value = "Current location";
        fromInput.readOnly = true; // optional (Google-style lock)
      }

      // Create once, then update
      if (!window.userMarker) {
        window.userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "You are here",
          icon: {
             path: google.maps.SymbolPath.CIRCLE,
            scale: 8, // inner dot size
            fillColor: "#1e90ff",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2
          }
        });
      } else {
        window.userMarker.setPosition(userLocation);
      }

      // ✅ Only focus once (first good fix)
      if (!hasAutoCentered) {
        map.setCenter(userLocation);
        map.setZoom(16);
        hasAutoCentered = true;
      }

      liveRerouteIfNeeded();
      updateStepsLive(userLocation);

    },
    (err) => {
      console.warn("Geolocation error:", err.message);
      alert("Unable to detect your location accurately. Try moving to an open area.");
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000
    }
  );
}

function getUserLocationPrompt() {
  setupLocationPrePrompt();
}

/* ===== Sliding Menu & Tabs (unchanged) ===== */
function toggleSideMenu(){
  const menu = document.getElementById("sideMenu");
  const open = menu.classList.toggle("open");
  document.body.classList.toggle("menu-open", open);
  closeDeptPanel();
}

function closeSideMenu(){
  const menu = document.getElementById("sideMenu");
  if (!menu) return;

  menu.classList.remove("open");
  document.body.classList.remove("menu-open");
}

// direction panel
function toggleDirectionPanel(){
  const dir = document.getElementById("dirPanel");
  const isOpening = !dir.classList.contains("open");

  if (isOpening) {
    // opening: normal
    dir.classList.add("open");
    document.body.classList.add("dir-open");
    document.body.classList.remove("dir-closing");
  } else {
    // closing: keep "dir-open" active until animation ends
    document.body.classList.add("dir-closing");
    dir.classList.remove("open");

    const onEnd = (e) => {
      if (e.propertyName !== "left" && e.propertyName !== "transform") return;
      dir.removeEventListener("transitionend", onEnd);

      // now it's fully closed
      document.body.classList.remove("dir-open");
      document.body.classList.remove("dir-closing");
    };

    dir.addEventListener("transitionend", onEnd);
  }
  closeDeptPanel();
} 

function closeDirectionPanel(){
  const dir = document.getElementById("dirPanel");
  if (!dir) return;

  dir.classList.remove("open");
  document.body.classList.remove("dir-open");
}

function toggleDepartments() {
  document.getElementById("departmentMenu").classList.toggle("open");
}

function openTab(tabName) {
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach(c => c.classList.add("hidden"));

  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach(b => b.classList.remove("active"));

  document.getElementById(tabName).classList.remove("hidden");

  const btn = Array.from(buttons).find(b => b.getAttribute("onclick") === `openTab('${tabName}')`);
  if (btn) btn.classList.add("active");
}

/* ===== Department Panel Drag (unchanged) ===== */
const deptPanel = document.getElementById("deptPanel");
const handle = deptPanel.querySelector(".panel-handle");
let isDragging = false, startY, startBottom;

handle.addEventListener("mousedown", startDrag);
handle.addEventListener("touchstart", startDrag);

function startDrag(e) {
  isDragging = true;
  startY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
  startBottom = parseInt(getComputedStyle(deptPanel).bottom);

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("touchend", stopDrag);
}

function onDrag(e) {
  if (!isDragging) return;

  const currentY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;
  let newBottom = startBottom + (startY - currentY);
  const maxHeight = window.innerHeight * 0.7;

  newBottom = Math.min(Math.max(newBottom, -maxHeight), 0);
  deptPanel.style.bottom = newBottom + "px";
}

function stopDrag() {
  isDragging = false;
  const threshold = -window.innerHeight * 0.35;
  const currentBottom = parseInt(getComputedStyle(deptPanel).bottom);

  if (currentBottom < threshold) closeDeptPanel();
  else deptPanel.classList.add("open"), deptPanel.style.bottom = "";

  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);
}

function openDeptPanel(dept) {
  currentDept = dept;

  console.log("OPENED DEPT:", dept);
  console.log("TITLE:", dept.title);
  console.log("PANOSCENE:", dept.panoScene);
  console.log("PANOPREVIEW:", dept.panoPreview);

  document.getElementById("deptTitle").textContent = dept.title;
  document.getElementById("overviewText").textContent =
    dept.overview || "Overview info not available.";
  document.getElementById("aboutText").textContent =
    dept.about || "About info not available.";

  // overview gallery
  const galleryEl = document.getElementById("overviewGallery");
  if (galleryEl) {
    const imgs = Array.isArray(dept.gallery) && dept.gallery.length
      ? dept.gallery
      : (dept.image ? [dept.image] : []);

    galleryEl.innerHTML = imgs.map(src =>
      `<img src="${src}" alt="${dept.title}">`
    ).join("");
  }

  // pano preview
    const panoWrap = document.getElementById("panoPreviewFloating");
    const panoImg = document.getElementById("panoPreviewImg");

    if (panoWrap && panoImg) {
      const hasPreview =
        dept.panoPreview &&
        dept.panoScene &&
        dept.panoPreview !== "null" &&
        dept.panoScene !== "null";

      if (hasPreview) {
        panoImg.src = dept.panoPreview;
        panoImg.alt = `${dept.title} Panorama Preview`;
        panoWrap.classList.remove("hidden");
      } else {
        panoImg.src = "";
        panoImg.alt = "";
        panoWrap.classList.add("hidden");
      }
    }
  //separate q lng
  renderAbout(dept);

  let btn = document.getElementById("directionsBtn");

  if (!btn) {
    btn = document.createElement("button");
    btn.id = "directionsBtn";
    btn.type = "button";
    btn.style.marginTop = "10px";
    btn.textContent = "Get Directions";
    deptPanel.appendChild(btn);
  }

  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  newBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    getDirectionsToDept(dept);
  });

  openTab("overview");
  deptPanel.classList.add("open");
}

//close dept panel 
function closeDeptPanel() {
  deptPanel.classList.remove("open");
  deptPanel.style.bottom = "";

  const panoWrap = document.getElementById("panoPreviewFloating");
  const panoImg = document.getElementById("panoPreviewImg");

  if (panoWrap && panoImg) {
    panoWrap.classList.add("hidden");
    panoImg.src = "";
    panoImg.alt = "";
  }

  currentDept = null;
}

window.getDirectionsToDept = getDirectionsToDept;
window.openDeptPanel = openDeptPanel;
window.initMap = initMap;

//search
function setupSearchPanel(map, locations) {
  const input = document.getElementById("mapSearch");
  const panel = document.getElementById("searchPanel");
  const clearBtn = document.getElementById("clearSearch");
  const toggleBtn = document.getElementById("searchToggle");

  if (!input || !panel) return;

  const pill = input.closest(".gm-pill");
  const topbar = document.querySelector(".topbar");
    /* FIX: keep taps inside search pill from bubbling to document/map */
  pill?.addEventListener("click", (e) => e.stopPropagation());
  pill?.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: true });

  const key = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  let current = [];

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function openMobileSearch() {
    if (!isMobile()) return;
    topbar.classList.add("expanded");
    setTimeout(() => input.focus(), 180);
  }

  function closeMobileSearch() {
    if (!isMobile()) return;
    topbar.classList.remove("expanded");
  }

  function closePanel() {
    panel.classList.remove("open");
    panel.innerHTML = "";
    current = [];

    if (isMobile()) {
      closeMobileSearch();
    }
  }

  function goTo(loc) {
    input.value = loc.title;
    panel.classList.remove("open");
    panel.innerHTML = "";
    current = [];

    map.panTo(loc.position);
    map.setZoom(19);

    if (loc.marker) {
      google.maps.event.trigger(loc.marker, "click");
    }

    if (isMobile()) {
      closeMobileSearch();
    }
  }

  function render(list) {
    current = list;

    if (!list.length) {
      panel.classList.remove("open");
      panel.innerHTML = "";
      return;
    }

    panel.innerHTML = list
      .slice(0, 6)
      .map((l, i) => `<button type="button" data-i="${i}">${l.title}</button>`)
      .join("");

    panel.classList.add("open");

    panel.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.i);
        goTo(current[i]);
      });
    });
  }

  input.addEventListener("input", () => {
    const q = key(input.value);

    if (!q) {
      panel.classList.remove("open");
      panel.innerHTML = "";
      return;
    }

    //added
    /* FIX: tapping the input on mobile should keep search open */
  input.addEventListener("touchstart", (e) => {
    e.stopPropagation();
    if (isMobile()) topbar.classList.add("expanded");
  }, { passive: true });

    const matches = locations.filter((l) => key(l.title).includes(q));
    render(matches);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePanel();
      return;
    }

    if (e.key === "Enter") {
      const q = key(input.value);
      if (!q) return;

      const hit =
        locations.find((l) => key(l.title) === q) ||
        locations.find((l) => key(l.title).includes(q));

      if (hit) goTo(hit);
    }
  });

  clearBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    input.value = "";
    panel.classList.remove("open");
    panel.innerHTML = "";
    input.focus();
  });

  /* FIX: use one shared handler for both click and touch on mobile */
function handleSearchToggle(e) {
  e.preventDefault();
  e.stopPropagation();

  if (isMobile()) {
    if (topbar.classList.contains("expanded")) {
      closePanel();
    } else {
      openMobileSearch();
    }
  } else {
    input.focus();
  }
}

toggleBtn?.addEventListener("click", handleSearchToggle);

/* FIX: mobile sometimes needs touchstart instead of click */
toggleBtn?.addEventListener("touchstart", handleSearchToggle, { passive: false });

  document.addEventListener("click", (e) => {
    if (!pill.contains(e.target)) {
      closePanel();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      topbar.classList.remove("expanded");
      panel.classList.remove("open");
    }
  });
}

let gyroEnabled = false;
let gyroListener = null;
let lastHeading = null;
const HEADING_SMOOTH = 0.15; // 0.05–0.25 (higher = snappier)

function normalizeDeg(d) {
  d = d % 360;
  return d < 0 ? d + 360 : d;
}

// shortest angle difference (-180..180)
function angleDelta(a, b) {
  let d = (b - a + 540) % 360 - 180;
  return d;
}

function applyHeadingSmooth(target) {
  if (lastHeading == null) lastHeading = target;

  const d = angleDelta(lastHeading, target);
  lastHeading = normalizeDeg(lastHeading + d * HEADING_SMOOTH);

  // rotate the map
  map.setHeading(lastHeading);
}

async function requestGyroPermissionIfNeeded() {
  // iOS Safari requires permission (must be inside a user gesture/click)
  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {
    const res = await DeviceOrientationEvent.requestPermission();
    if (res !== "granted") throw new Error("Gyro permission denied");
  }
}

function startGyro() {
  if (!window.DeviceOrientationEvent) {
    alert("Gyro not supported on this device/browser.");
    return;
  }

  // best experience: satellite + tilt enabled
  map.setTilt(45); // optional, comment out if you hate tilt

  const handler = (e) => {
    // Option A (most common): compass heading if available (iOS Safari)
    if (typeof e.webkitCompassHeading === "number") {
      applyHeadingSmooth(normalizeDeg(e.webkitCompassHeading));
      return;
    }

    // Option B: use alpha (Android Chrome often)
    // alpha is 0-360 degrees (device orientation around Z axis)
    if (typeof e.alpha === "number") {
      // Some devices invert direction; if it rotates opposite, use (360 - e.alpha)
      applyHeadingSmooth(normalizeDeg(360 - e.alpha));
    }
  };

  // store so we can remove later
  gyroListener = handler;

  // iOS: 'deviceorientation' often works better than absolute
  window.addEventListener("deviceorientation", gyroListener, true);
}

function stopGyro() {
  if (gyroListener) {
    window.removeEventListener("deviceorientation", gyroListener, true);
    gyroListener = null;
  }
  gyroEnabled = false;
  lastHeading = null;

  // reset map rotation/tilt
  map.setHeading(0);
  map.setTilt(0);
}

async function toggleGyro() {
  const btn = document.getElementById("gyroBtn");

  if (gyroEnabled) {
    stopGyro();
    if (btn) btn.textContent = "Gyro: OFF";
    return;
  }

  try {
    await requestGyroPermissionIfNeeded();
    gyroEnabled = true;
    startGyro();
    if (btn) btn.textContent = "Gyro: ON";
  } catch (err) {
    console.warn(err);
    alert("Gyro permission not granted.");
    gyroEnabled = false;
    if (btn) btn.textContent = "Gyro: OFF";
  }
}

//marker rev
function revealMarkers() {
  if (!map || !markers.length) return;

  markers.forEach((m, i) => {
    setTimeout(() => {
      m.setMap(map);
      m.setAnimation(google.maps.Animation.BOUNCE);

      setTimeout(() => {
        m.setAnimation(null);
      }, 700);
    }, i * 30);
  });

  preloadHoverImages();
}

function setupLocationPrePrompt() {
  const backdrop = document.getElementById("locPromptBackdrop");
  const allowBtn = document.getElementById("locAllowBtn");
  const denyBtn = document.getElementById("locDenyBtn");
  const rememberChk = document.getElementById("locRememberChk");

  if (!backdrop || !allowBtn || !denyBtn) return;

  const sessionSaved = sessionStorage.getItem("navfinder_loc_prompt");
  const permanentSaved = localStorage.getItem("navfinder_loc_prompt");

  if (sessionSaved === "allow") {
    backdrop.classList.add("hidden");
    revealMarkers();

    setTimeout(() => {
      getUserLocation();
      startMapGpsShare();
    }, 0);

    return;
  }

  if (permanentSaved === "deny_permanent") {
    backdrop.classList.add("hidden");
    revealMarkers();
    return;
  }

  // show prompt
  backdrop.classList.remove("hidden");

  function closePrompt() {
    backdrop.classList.add("hidden");
    revealMarkers();
  }

  // IMPORTANT: overwrite old handlers cleanly
  allowBtn.onclick = () => {
  sessionStorage.setItem("navfinder_loc_prompt", "allow");
  localStorage.removeItem("navfinder_loc_prompt");
  closePrompt();

  setTimeout(() => {
    getUserLocation();
    startMapGpsShare();
  }, 0);
};

  denyBtn.onclick = () => {
    if (rememberChk?.checked) {
      localStorage.setItem("navfinder_loc_prompt", "deny_permanent");
    }
    closePrompt();
  };
}

function openLocationPrompt() {
  const backdrop = document.getElementById("locPromptBackdrop");
  if (!backdrop) return;

  backdrop.classList.remove("hidden");
}

//clear route function
function clearRoute() {
  // ✅ stop “live navigation” first so it won’t redraw on next GPS tick
  NAV_ACTIVE = false;
  NAV_DEST = null;

  // if you have your own live timers/intervals, stop them here too
  // e.g. if (window.liveNavTimer) { clearInterval(window.liveNavTimer); window.liveNavTimer=null; }

  // Remove route line(s)
  if (activeRoute) {
    activeRoute.setMap(null);
    activeRoute = null;
  }

  if (window.routeLine) {
    window.routeLine.setMap(null);
    window.routeLine = null;
  }

  if (dashAnimTimer) {
    clearInterval(dashAnimTimer);
    dashAnimTimer = null;
  }

  // Clear directions 
  // Clear directions UI
  const dirSteps = document.getElementById("dirSteps");
  if (dirSteps) dirSteps.innerHTML = "";

  // Clear inputs
  //const fromInput = document.getElementById("fromInput");
  const toInput = document.getElementById("toInput");
  //if (fromInput) fromInput.value = "";
  if (toInput) toInput.value = "";

  console.log("✅ Route cleared (nav stopped)");
}

//panorama
function openDeptPanorama() {
  if (!currentDept || !currentDept.panoScene || !currentDept.panoPreview) return;

  window.location.href = `streetview.html?scene=${encodeURIComponent(currentDept.panoScene)}`;
}


// ===================== SHARED LIVE USER MAP =====================

const socket = io("https://prmsu-wayfinder.onrender.com");

const ME_ID =
  sessionStorage.getItem("wayfinder_user_id") ||
  ("u_" + Math.random().toString(36).slice(2, 10));

sessionStorage.setItem("wayfinder_user_id", ME_ID);

const ME_NAME =
  sessionStorage.getItem("wayfinder_user_name") ||
  ("User-" + Math.floor(Math.random() * 900 + 100));

sessionStorage.setItem("wayfinder_user_name", ME_NAME);

// store other users as: { marker, glow }
const liveUserMarkers = new Map();

let gpsShareStarted = false;
let lastPresenceSentAt = 0;
const PRESENCE_SEND_MS = 1000;

function isInsideCampus(pos) {
  if (!campusBounds || !pos) return false;
  return campusBounds.contains(new google.maps.LatLng(pos.lat, pos.lng));
}

// =========================
// OTHER USERS MARKER + GLOW
// =========================
function upsertLiveUserMarker(u) {
  const mapRef = window.map || map;
  if (!mapRef) return;
  if (!u || typeof u.lat !== "number" || typeof u.lng !== "number") return;
  if (u.id === ME_ID) return;

  const pos = { lat: u.lat, lng: u.lng };
  let entry = liveUserMarkers.get(u.id);

  if (!entry) {
    // glow behind marker
    const glow = new google.maps.Circle({
      map: mapRef,
      center: pos,
      radius: 10, // meters
      strokeOpacity: 0,
      fillColor: "#ff3b30",
      fillOpacity: 0.22,
      zIndex: 1
    });

    // actual user dot
    const marker = new google.maps.Marker({
      map: mapRef,
      position: pos,
      title: u.name || "Active User",
      zIndex: 2,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#ff3b30",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2
      },
      label: {
        text: (u.name || "User").slice(0, 10),
        className: "marker-label"
      }
    });

    entry = { marker, glow };
    liveUserMarkers.set(u.id, entry);
  } else {
    entry.marker.setPosition(pos);
    entry.glow.setCenter(pos);
  }
}

function removeMissingLiveMarkers(users) {
  const activeIds = new Set((users || []).map(u => u.id));

  for (const [id, entry] of liveUserMarkers.entries()) {
    if (!activeIds.has(id)) {
      if (entry.marker) entry.marker.setMap(null);
      if (entry.glow) entry.glow.setMap(null);
      liveUserMarkers.delete(id);
    }
  }
}

socket.on("connect", () => {
  socket.emit("presence:join", {
    id: ME_ID,
    name: ME_NAME
  });
});

socket.on("presence:update", (users) => {
  removeMissingLiveMarkers(users);

  for (const u of users || []) {
    if (!u) continue;
    if (u.id === ME_ID) continue;
    upsertLiveUserMarker(u);
  }
});

function sendMyPresence(lat, lng, acc = null) {
  if (!socket || !socket.connected) return;

  const now = Date.now();
  if (now - lastPresenceSentAt < PRESENCE_SEND_MS) return;
  lastPresenceSentAt = now;

  const pos = { lat, lng };

  socket.emit("presence:heartbeat", {
    id: ME_ID,
    name: ME_NAME,
    lat,
    lng,
    acc,
    insideCampus: isInsideCampus(pos),
    lastSeen: now
  });
}

function startMapGpsShare() {
  if (!navigator.geolocation || gpsShareStarted) return;
  gpsShareStarted = true;

  navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = Math.round(pos.coords.accuracy || 0);

      sendMyPresence(lat, lng, acc);
    },
    (err) => console.warn("GPS share error:", err.message),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000
    }
  );
}