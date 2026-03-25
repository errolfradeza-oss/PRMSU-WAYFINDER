/* ===== LIVE NAV (reroute while walking) ===== */
let NAV_ACTIVE = false;
let NAV_DEST = null; // store dept object

let lastRerouteTime = 0;
let lastReroutePos = null;

const REROUTE_MIN_MS = 1200;   // don't reroute too often
const REROUTE_MIN_METERS = 7;  // reroute only if user moved enough
const OFF_ROUTE_METERS = 18;   // reroute faster if user is off the line

//for smart reroute
function startLiveNavigation(dept) {
  NAV_ACTIVE = true;
  NAV_DEST = dept;
  lastRerouteTime = 0;
  lastReroutePos = null;
}

//for smart reroute
function stopLiveNavigation() {
  NAV_ACTIVE = false;
  NAV_DEST = null;
  lastRerouteTime = 0;
  lastReroutePos = null;
}

//for smart reroute
function distancePointToSegmentMeters(p, a, b) {
  const pLL = new google.maps.LatLng(p.lat, p.lng);
  const aLL = new google.maps.LatLng(a.lat, a.lng);
  const bLL = new google.maps.LatLng(b.lat, b.lng);

  if (a.lat === b.lat && a.lng === b.lng) {
    return google.maps.geometry.spherical.computeDistanceBetween(pLL, aLL);
  }

  const ab = google.maps.geometry.spherical.computeDistanceBetween(aLL, bLL);
  const ap = google.maps.geometry.spherical.computeDistanceBetween(aLL, pLL);
  const bp = google.maps.geometry.spherical.computeDistanceBetween(bLL, pLL);

  let cosA = (ab * ab + ap * ap - bp * bp) / (2 * ab * ap);
  cosA = Math.max(-1, Math.min(1, cosA));
  const proj = ap * cosA;

  let t = proj / ab;
  t = Math.max(0, Math.min(1, t));

  const interp = google.maps.geometry.spherical.interpolate(aLL, bLL, t);
  return google.maps.geometry.spherical.computeDistanceBetween(pLL, interp);
}

//for smart reroute
function distanceToPathMeters(p, path) {
  if (!path || path.length < 2) return Infinity;

  let best = Infinity;
  for (let i = 0; i < path.length - 1; i++) {
    const d = distancePointToSegmentMeters(p, path[i], path[i + 1]);
    if (d < best) best = d;
  }
  return best;
}

//for smart reroute
function liveRerouteIfNeeded() {
  if (!NAV_ACTIVE || !NAV_DEST || !userLocation) return;

  const now = Date.now();

  const moved =
    lastReroutePos ? distanceMeters(userLocation, lastReroutePos) : Infinity;

  const tooSoon = (now - lastRerouteTime) < REROUTE_MIN_MS;
  const tooLittleMove = moved < REROUTE_MIN_METERS;

  // read currently drawn route
  const currentPath =
    window.routeLine?.getPath()?.getArray()?.map(ll => ({
      lat: ll.lat(),
      lng: ll.lng()
    })) || null;

  const offRoute =
    currentPath
      ? distanceToPathMeters(userLocation, currentPath) > OFF_ROUTE_METERS
      : true;

  if (!offRoute && (tooSoon || tooLittleMove)) return;

  // don't keep rerouting when already near destination
  const distToDest = distanceMeters(userLocation, NAV_DEST.position);
  if (distToDest <= 20) return;

  // same origin logic as main routing
  let nearestNode = getNearestRoutePoint(userLocation);
  const distToRoute = nearestNode ? distanceMeters(userLocation, nearestNode) : Infinity;

  let routingOrigin = userLocation;
  if (distToRoute > 35) {
    const { snapped: gatePoint } = snapUserToGateOnly(userLocation);
    routingOrigin = gatePoint;
  }

  const startPt = getNearestRoutePoint(routingOrigin);
  const endPt = getNearestRoutePoint(NAV_DEST.position);

  if (!startPt || !endPt) return;

  const path = shortestPath(CAMPUS_GRAPH, coordKey(startPt), coordKey(endPt));
  if (!path || path.length < 2) return;

  drawCampusRoute(path);

  const steps = buildTurnByTurn(path, NAV_DEST.title);
  renderDirectionsSteps(steps);

  lastRerouteTime = now;
  lastReroutePos = { ...userLocation };

  console.log("🔄 Route updated from current location");
}

// optional: expose stop button
window.stopLiveNavigation = stopLiveNavigation;



//offscreen pointer helper
const EDGE_PADDING = 150;

let offscreenArrowEl = null;
let projectionHelper = null;

function initOffscreenArrow() {
  offscreenArrowEl = document.getElementById("offscreenArrow");
}

function initProjectionHelper() {
  projectionHelper = new google.maps.OverlayView();

  projectionHelper.onAdd = function () {};
  projectionHelper.draw = function () {};
  projectionHelper.onRemove = function () {};

  projectionHelper.setMap(map);
}

function hideOffscreenArrow() {
  if (offscreenArrowEl) {
    offscreenArrowEl.classList.add("hidden");
  }
}

function showOffscreenArrow(x, y, angleDeg) {
  if (!offscreenArrowEl) return;

  offscreenArrowEl.style.left = `${x}px`;
  offscreenArrowEl.style.top = `${y}px`;
  offscreenArrowEl.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
  offscreenArrowEl.classList.remove("hidden");
}

function updateOffscreenArrow() {
  if (!map || !offscreenArrowEl || !projectionHelper || !userLocation) {
    hideOffscreenArrow();
    return;
  }

  const projection = projectionHelper.getProjection();
  if (!projection) {
    hideOffscreenArrow();
    return;
  }

  let userLatLng = userLocation;

  // Support either google.maps.LatLng or plain {lat, lng}
  if (!(userLatLng instanceof google.maps.LatLng)) {
    if (
      typeof userLatLng.lat === "number" &&
      typeof userLatLng.lng === "number"
    ) {
      userLatLng = new google.maps.LatLng(userLatLng.lat, userLatLng.lng);
    } else {
      hideOffscreenArrow();
      return;
    }
  }

  // Hide arrow if user is inside campus bounds
  if (campusBounds && campusBounds.contains(userLatLng)) {
    hideOffscreenArrow();
    return;
  }

  const mapDiv = map.getDiv();
  if (!mapDiv) {
    hideOffscreenArrow();
    return;
  }

  const rect = mapDiv.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    hideOffscreenArrow();
    return;
  }

  const userPixel = projection.fromLatLngToDivPixel(userLatLng);
  if (!userPixel) {
    hideOffscreenArrow();
    return;
  }

  // center of the map div
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  // padded visible box
  const minX = EDGE_PADDING;
  const minY = EDGE_PADDING;
  const maxX = rect.width - EDGE_PADDING;
  const maxY = rect.height - EDGE_PADDING;

  // vector from center to true user screen position
  const dx = userPixel.x - cx;
  const dy = userPixel.y - cy;

  if (dx === 0 && dy === 0) {
    hideOffscreenArrow();
    return;
  }

  const hits = [];

  // intersect ray with left/right sides
  if (dx !== 0) {
    const tLeft = (minX - cx) / dx;
    const yLeft = cy + tLeft * dy;
    if (tLeft > 0 && yLeft >= minY && yLeft <= maxY) {
      hits.push({ t: tLeft, x: minX, y: yLeft });
    }

    const tRight = (maxX - cx) / dx;
    const yRight = cy + tRight * dy;
    if (tRight > 0 && yRight >= minY && yRight <= maxY) {
      hits.push({ t: tRight, x: maxX, y: yRight });
    }
  }

  // intersect ray with top/bottom sides
  if (dy !== 0) {
    const tTop = (minY - cy) / dy;
    const xTop = cx + tTop * dx;
    if (tTop > 0 && xTop >= minX && xTop <= maxX) {
      hits.push({ t: tTop, x: xTop, y: minY });
    }

    const tBottom = (maxY - cy) / dy;
    const xBottom = cx + tBottom * dx;
    if (tBottom > 0 && xBottom >= minX && xBottom <= maxX) {
      hits.push({ t: tBottom, x: xBottom, y: maxY });
    }
  }

  if (!hits.length) {
    hideOffscreenArrow();
    return;
  }

  // nearest valid border hit
  hits.sort((a, b) => a.t - b.t);
  const hit = hits[0];

  const screenX = rect.left + hit.x;
  const screenY = rect.top + hit.y;

  // +90 because arrow shape points upward by default
  const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI + 90;

  showOffscreenArrow(screenX, screenY, angleDeg);
}