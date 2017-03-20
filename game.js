'use strict';
function rand(from, to) {
  return Math.floor((to - from + 1) * Math.random()) + from;
}

function randomItem(list) {
  const next = list[rand(0, list.length - 1)];
  if (randomItem.prev && randomItem.prev === next) {
    return randomItem(list);
  }
  randomItem.prev = next;
  return next;
}

function loadTopScore() {
  if (!localStorage) return 0;
  const score = localStorage.getItem('topScore');
  return score ? score : 0;
}

function saveTopScore(score) {
  if (!localStorage) return;
  localStorage.setItem('topScore', score);
}

function show(hole) {
  hole.classList.remove('boom');
  hole.classList.add('up');
}

function hide(hole) {
  hole.classList.remove('up');
}

function timeToString(time) {
  const MSECONDS_IN_SEC = 1000;
  const MSECONDS_IN_MIN = 60 * MSECONDS_IN_SEC;

  let min = Math.floor(time / MSECONDS_IN_MIN);
  let sec = Math.floor((time % MSECONDS_IN_MIN) / MSECONDS_IN_SEC);
  let msec = (time % MSECONDS_IN_MIN) % MSECONDS_IN_SEC;
  let spacer = msec > 500 ? ':' : '&nbsp;';
  return [min, sec]
    .map(number => number >= 10 ? number : `0${number}`)
    .join(spacer);
}

function updateTimer() {
  if (!isStarted) {
    return;
  }

  let timeout = GAME_TIMEOUT - (Date.now() - startedAt);
  if (timeout < 0 ) {
    timeout = 0;
  }
  timer.innerHTML = timeToString(timeout);
}

function updateScoreboard(points) {
  scoreboard.dataset.points = points;
  bestScore.dataset.points = topScore;
}

function handleClick() {
  const hole = this.parentElement;
  if (!hole.timeout) {
    return;
  }
  clearTimeout(hole.timeout);
  hole.classList.add('boom');
  setTimeout(() => {
    hide(hole);
    ++points;
    updateScoreboard(points);
  }, 50);
}

function next() {
  const hole = randomItem(holes);
  show(hole);
  hole.timeout = setTimeout(i => {
    hide(hole);
  }, rand(800, 2500));
}

function tic() {
  setTimeout(() => {
    if (isStarted) {
      next();
      tic();
    } else {
      startButton.style.display = 'initial';
      timer.style.display = 'none';
      topScore = Math.max(points, topScore);
      saveTopScore(topScore);
      updateScoreboard(points);
      clearInterval(timerInterval);
    }
  }, rand(1000, 3500));
}

function start() {
  points = 0;
  startedAt = Date.now();
  updateScoreboard(points);
  startButton.style.display = 'none';
  timer.style.display = 'initial';
  isStarted = true;
  timerInterval = setInterval(updateTimer, 250);
  tic();

  setTimeout(() => isStarted = false, GAME_TIMEOUT);
}

const GAME_TIMEOUT = 15000;
let timeout, timerInterval, isStarted = false, startedAt;
let topScore = loadTopScore();
let points = 0;

const holes = document.getElementsByClassName('hole');
const moles = document.getElementsByClassName('mole');
const scoreboard = document.getElementById('currentScoreView');
const bestScore = document.getElementById('topScoreView');
const startButton = document.querySelector('.startButton');
const timer = document.querySelector('.timer');
Array.from(moles).forEach(mole => mole.addEventListener('click', handleClick));
startButton.addEventListener('click', start);

updateScoreboard(points);
