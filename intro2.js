const FADE_TIME = 700;
const ZOOM_TIME = 1200;

const SCREEN1_IDLE = 10000;
const SCREEN2_REVEAL_DELAY = 0;
const SCREEN2_AUTO_AFTER_READY = 8500;

const SCREEN3_RAMON_DELAY = 900;
const SCREEN3_UI_DELAY = 900;

let locked = false;
let autoTimer = null;
let currentScreen = 1;
let screen2Ready = false;
let revealTimers = [];

function clearRevealTimers() {
  revealTimers.forEach(timer => clearTimeout(timer));
  revealTimers = [];
}

function clearAutoTimer() {
  clearTimeout(autoTimer);
  autoTimer = null;
}

function startTimer() {
  clearAutoTimer();

  if (currentScreen === 1) {
    autoTimer = setTimeout(() => {
      next(1);
    }, SCREEN1_IDLE);
  }
}

function runScreenReveals(screenNumber) {
  clearRevealTimers();

 if (screenNumber === 2) {
  const content = document.getElementById("screen2Content");
  const bg = document.querySelector(".prmsu-bg");

  content.classList.add("show");
bg.classList.add("blurred-bg");
  screen2Ready = true;

  clearAutoTimer();
  autoTimer = setTimeout(() => {
    next(2);
  }, SCREEN2_AUTO_AFTER_READY);
}

  if (screenNumber === 3) {
    const ramon = document.getElementById("screen3Ramon");
    const ui = document.getElementById("screen3UI");

    ramon.classList.remove("show");
    ui.classList.remove("show");

    const ramonTimer = setTimeout(() => {
      ramon.classList.add("show");
    }, SCREEN3_RAMON_DELAY);

    const uiTimer = setTimeout(() => {
      ui.classList.add("show");
    }, SCREEN3_UI_DELAY);

    revealTimers.push(ramonTimer, uiTimer);
  }
}


 function next(n) {
  if (locked) return;

  locked = true;

  locked = true;
  clearAutoTimer();
  clearRevealTimers();

  const current = document.getElementById("s" + n);
  const nextScreen = document.getElementById("s" + (n + 1));

  if (!current || !nextScreen) {
    locked = false;
    return;
  }

  if (n === 1) {
  current.classList.add("zooming");

  setTimeout(() => {
    nextScreen.classList.add("active");
    current.classList.remove("active");
    current.classList.remove("zooming");

    currentScreen = 2;
    runScreenReveals(2);
    locked = false;
  }, ZOOM_TIME);

  return;
}

  if (n === 2) {
  current.classList.add("zooming");

  setTimeout(() => {
    nextScreen.classList.add("active");
    current.classList.remove("active");

    current.classList.remove("zooming");
    currentScreen = 3;
    runScreenReveals(3);
    locked = false;

  }, ZOOM_TIME);

  return;
}

} 

function goLogin() {
  window.location.href = "Wayfinder.html";
}

window.addEventListener("load", () => {
  currentScreen = 1;
  startTimer();
});