//for dir panel highlighting
let currentStepIndex = 0;

//helper function for m to km 
function formatDistance(meters) {
  if (meters >= 1000) {
    return (meters / 1000).toFixed(2) + " km";
  }
  return Math.round(meters) + " m";
}

//helper function for compass
function getNearestSegment(route, userLoc) {

    if (!route || route.length < 2) return null;

    let best = null;
    let bestDist = Infinity;

    const userLL = new google.maps.LatLng(userLoc.lat, userLoc.lng);

    for (let i = 0; i < route.length - 1; i++) {

        const A = new google.maps.LatLng(route[i].lat, route[i].lng);
        const B = new google.maps.LatLng(route[i + 1].lat, route[i + 1].lng);

        const dist = distancePointToSegmentMeters(
            userLoc,
            route[i],
            route[i + 1]
        );

        if (dist < bestDist) {

            bestDist = dist;

            best = {

                index: i,

                bearing:
                    (
                        google.maps.geometry.spherical.computeHeading(A, B)
                        + 360
                    ) % 360

            };

        }

    }

    return best;

}

/* function getCurrentStep(userLoc, steps) {

    for (let i = 0; i < steps.length; i++) {

        const d = distanceMeters(userLoc, steps[i].at);

        if (d > 8) {
            return i;
        }

    }

    return steps.length - 1;
} */


//main code for destination page

function setCurrentLocationName(name) {
  const from = document.getElementById("fromInput");
  from.value = name;  
}

function setDestination(deptName) {
  const to = document.getElementById("toInput");
  to.value = deptName;
}

//new modified
function renderDirectionsSteps(steps) {
  const box = document.getElementById("dirSteps");
  if (!box) return;

  box.innerHTML = "";

  let activeRow = null;

  steps.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "dir-step";

    if (i === currentStepIndex) {
      row.classList.add("active");
      activeRow = row;
    }

    const num = document.createElement("div");
    num.className = "dir-step-num";
    num.textContent = i + 1;

    const icon = document.createElement("div");
    icon.className = "dir-step-icon";

    //potangina dto
    icon.textContent =
      s.type === "turn" ? (s.dir === "left" ? "←" : "→") :
      s.type === "arrive" ? "●" :
      s.type === "start" ? "↑" :
      "↑";

    const text = document.createElement("div");
    text.className = "dir-step-text";
    text.textContent = s.text;

    row.append(num, icon, text);
    box.appendChild(row); 
  });

  // Automatically keep current step visible
  if (activeRow) {
    activeRow.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

//dto ung update steps
function getCurrentStep(userLoc, steps) {

    if (!steps.length) return 0;

    // Find the nearest step
    let nearest = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < steps.length; i++) {

        const d = distanceMeters(userLoc, steps[i].at);

        if (d < nearestDist) {
            nearestDist = d;
            nearest = i;
        }

    }

    // If already close enough to that step,
    // advance to the next instruction.
    if (nearestDist < 8 && nearest < steps.length - 1)
        return nearest + 1;

    return nearest;
}


function buildTurnByTurn(pathPoints, destinationName = "Destination") {
  if (!pathPoints || pathPoints.length < 2) return [];

  const steps = [];

  const toLL = (p) => {
  if (!p) throw new Error("Invalid route point");

  // google.maps.LatLng
  if (typeof p.lat === "function" && typeof p.lng === "function") {
    return p;
  }

  // plain object {lat, lng}
  if (typeof p.lat === "number" && typeof p.lng === "number") {
    return new google.maps.LatLng(p.lat, p.lng);
  }

  throw new Error("Invalid route point format: " + JSON.stringify(p));
};

  const MIN_STEP_DIST_M = 15;
  const TURN_ANGLE_DEG = 25;
  const STRONG_TURN_DEG = 65;

  let accumDist = 0;
  let continueStartIndex = 0; // start index of current "continue" segment

  function pushContinue(endIndex) {
    if (accumDist >= MIN_STEP_DIST_M) {
      const ll = toLL(pathPoints[endIndex]);
      steps.push({
        type: "continue",
        text: `Continue for ${formatDistance(accumDist)}`,
        baseText: "Continue",
        atIndex: endIndex,
        at: { lat: ll.lat(), lng: ll.lng() },
        // used for live distance update (distance from user to this endIndex)
        continueStartIndex
      });
    }
    accumDist = 0;
    continueStartIndex = endIndex;
  }

  // START step anchored at first point
  {
    const ll0 = toLL(pathPoints[0]);
    steps.push({
      type: "start",
      text: "Walk towards the highlighted path to begin navigation",
      baseText: "Walk towards the highlighted path to begin navigation",
      atIndex: 0,
      at: { lat: ll0.lat(), lng: ll0.lng() }
    });
  }

  for (let i = 1; i < pathPoints.length - 1; i++) {
    const A = toLL(pathPoints[i - 1]);
    const B = toLL(pathPoints[i]);
    const C = toLL(pathPoints[i + 1]);

    accumDist += google.maps.geometry.spherical.computeDistanceBetween(B, C);

    const h1 = google.maps.geometry.spherical.computeHeading(A, B);
    const h2 = google.maps.geometry.spherical.computeHeading(B, C);

    const approachBearing = (h1 + 360) % 360;
    const exitBearing = (h2 + 360) % 360;

    let delta = h2 - h1;
    delta = ((delta + 540) % 360) - 180;

    const abs = Math.abs(delta);
    if (abs < TURN_ANGLE_DEG) continue;

    // flush continue segment ending at point i
    pushContinue(i);

    const dir = delta > 0 ? "right" : "left";
    const sharp = abs >= STRONG_TURN_DEG ? "Sharp " : "";

    // modified
    steps.push({
      type: "turn",
      dir,

      // direction of the road BEFORE the turn
      approachBearing,

      // direction AFTER turning
      exitBearing,

      text: `${sharp}turn ${dir}`,
      baseText: `${sharp}turn ${dir}`,

      atIndex: i,
      at: {
          lat: B.lat(),
          lng: B.lng()
      }
  });
  }

  // final continue ends at last point
  pushContinue(pathPoints.length - 1);

  // ARRIVE anchored at last point
  {
    const llEnd = toLL(pathPoints[pathPoints.length - 1]);
    steps.push({
      type: "arrive",
      text: `Arrive at ${destinationName}`,
      baseText: `Arrive at ${destinationName}`,
      atIndex: pathPoints.length - 1,
      at: { lat: llEnd.lat(), lng: llEnd.lng() }
    });
  }

  return steps;
}

let LIVE_STEPS = [];
let LIVE_DEST_NAME = "";

function updateStepsLive(userLoc) {
  if (!NAV_ACTIVE) return;
  if (!userLoc) return;

  const userLL = new google.maps.LatLng(userLoc.lat, userLoc.lng);
  const isOutsideCampus = campusBounds && !campusBounds.contains(userLL);
  //new added
  const currentStep = getCurrentStep(userLoc, LIVE_STEPS);
  currentStepIndex = currentStep;
  //currentStepIndex = getCurrentStep(userLoc, LIVE_STEPS);

  // If outside campus, keep the original gate-based steps untouched
  if (isOutsideCampus) {
    renderDirectionsSteps(LIVE_STEPS);
    return;
  }

  const updated = LIVE_STEPS.map((s, index) => {
    // modified turn
    // Only update the CURRENT step
    if (index === currentStep) {

        // ---------------- TURN ----------------
    if (s.type === "turn") {

      const d = distanceMeters(userLoc, s.at);

      const pathBearing =
          d > 8
              ? s.approachBearing
              : s.exitBearing;

      const diff =
          relativeAngle(
              currentHeading,
              pathBearing
          );

      return {
          ...s,
          text:
  `${headingInstruction(diff)}
  ${formatDistance(d)}`
      };
  }

        // ---------------- CONTINUE ----------------
          if (s.type === "continue") {

          const d = distanceMeters(userLoc, s.at);

          const nearest = getNearestSegment(
              window.CURRENT_ROUTE,
              userLoc
          );

          if (!nearest) return s;

          const diff = relativeAngle(
              currentHeading,
              nearest.bearing
          );

          return {
              ...s,
              text:
      `${headingInstruction(diff)}
      ${formatDistance(d)}`
          };
      }
    }

    // ---------------- ARRIVE ----------------
    if (s.type === "arrive") {

        const d = distanceMeters(userLoc, s.at);

        if (d <= 8)
            return {
                ...s,
                text: "Arrived ✅"
            };

        return {
            ...s,
            text: `${s.baseText} (${formatDistance(d)})`
        };
    }

    // Update distance for non-active continue steps
    if (s.type === "continue") {

        const d = distanceMeters(userLoc, s.at);

        return {
            ...s,
            text: `${s.baseText} for ~${formatDistance(d)}`
        };
    }

    return s;
  });

  LIVE_STEPS = updated;
  renderDirectionsSteps(updated);
}

//comment testing hahahaha