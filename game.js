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
      topScore = Math.max(points, topScore);
      saveTopScore(topScore);
      updateScoreboard(points);
    }
  }, rand(1000, 3500));
}

function start() {
  points = 0;
  updateScoreboard(points);
  startButton.style.display = 'none';
  isStarted = true;
  tic();

  setTimeout(() => isStarted = false, 15000);
}

let timeout, isStarted = false;
let topScore = loadTopScore();
let points = 0;

const holes = document.getElementsByClassName('hole');
const moles = document.getElementsByClassName('mole');
const scoreboard = document.getElementById('currentScore');
const bestScore = document.getElementById('topScore');
const startButton = document.querySelector('.startButton');
Array.from(moles).forEach(mole => mole.addEventListener('click', handleClick));
startButton.addEventListener('click', start);

updateScoreboard(points);
