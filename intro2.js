const FADE_TIME = 700;
const ZOOM_TIME = 7500;

let locked = false;
let currentScreen = 1;
let screen2Shown = false;

function runScreenReveals(screenNumber) {
  if (screenNumber === 2) {
    screen2Shown = true;

    const s2 = document.getElementById("s2");
    const s3 = document.getElementById("s3");

    if (!s2 || !s3) {
      locked = false;
      return;
    }

    setTimeout(() => {
      s3.classList.add("prep-merge");
      s3.classList.add("active");

      requestAnimationFrame(() => {
        s2.classList.add("merge-out");
        s3.classList.add("merge-in");

        setTimeout(() => {
          s2.classList.remove("active", "merge-out");
          s3.classList.remove("prep-merge", "merge-in");

          currentScreen = 3;
          runScreenReveals(3);

          locked = false;
        }, FADE_TIME);
      });
    }, 250);
  }

  if (screenNumber === 3) {
    const ramon = document.getElementById("screen3Ramon");
    const ui = document.getElementById("screen3UI");

    if (ramon) ramon.classList.add("show");
    if (ui) ui.classList.add("show");
  }
}

function next(n) {
  if (locked) return;

  const current = document.getElementById("s" + n);
  const nextScreen = document.getElementById("s" + (n + 1));

  if (n === 1) {
    if (!current || !nextScreen) return;

    locked = true;

    const logo = document.querySelector(".logo-center");
    if (logo) logo.style.display = "none";

    current.classList.add("zooming");

    setTimeout(() => {
      current.classList.remove("active");
      current.classList.remove("zooming");
      nextScreen.classList.add("active");

      currentScreen = 2;
      screen2Shown = false;

      runScreenReveals(2);
    }, 1800);

    return;
  }

  if (n === 3) {
    goLogin();
  }
}

function goLogin() {
  window.location.href = "WayFinder.html";
}

window.addEventListener("load", () => {
  currentScreen = 1;

  const s1 = document.getElementById("s1");
  const s3 = document.getElementById("s3");

  if (s1) {
    s1.addEventListener("click", () => {
      if (currentScreen !== 1 || locked) return;
      next(1);
    });
  }

  if (s3) {
    s3.addEventListener("click", (e) => {
      if (locked) return;

      if (e.target.closest(".get-started-btn")) {
        goLogin();
        return;
      }

      if (currentScreen !== 3) return;
      next(3);
    });
  }
});