'use strict';

function rand(from, to) {
  return Math.floor((to - from + 1) * Math.random()) + from;
}

function getRandomBubble() {
  const next = lines[rand(0, lines.length - 1)];
  if (getRandomBubble.prev && next === getRandomBubble.prev) {
    return getRandomBubble();
  }
  getRandomBubble.prev = next;
  return next;
}

function showButton() {
  startButton.style.display = 'initial';
}

function hideButton() {
  startButton.style.display = 'none';
}

function showBubble(line) {
  line.classList.remove('boom');
  line.classList.add('up');
}

function hideBubble(line) {
  line.classList.remove('up');
}

function boomBubble(line) {
  line.classList.add('boom');
}

function nextBubble() {
  if (!isGameStarted) {
    return resetGame();
  }
  const bubble = getRandomBubble();
  showBubble(bubble);
  bubble.timeout = setTimeout(() => {
    hideBubble(bubble);
  }, rand(800, 2100));
  setTimeout(nextBubble, rand(800, 2100));
}

function handleBubbleClick() {
  const bubble = this.parentElement;
  clearTimeout(bubble.timeout);
  incPoints();
  boomBubble(bubble);
  hideBubble(bubble);
}

function updateScoreboard() {
  scoreboard.dataset.points = currentPoints;
}

function updateTopScore() {
  bestScore.dataset.points = topPoints;
}

function checkTopScore() {
  if (currentPoints <= topPoints) {
    return;
  }
  topPoints = currentPoints;
  updateTopScore();
  saveTopScore(topPoints);
}


function incPoints() {
  ++currentPoints;
  updateScoreboard();
}

function resetPoints() {
  currentPoints = 0;
  updateScoreboard();
}

function startGame() {
  resetPoints();
  isGameStarted = true;
  hideButton();
  nextBubble();
  setTimeout(stopGame, GAME_TIMEOUT)
}

function resetGame() {
  showButton();
  checkTopScore();
}

function stopGame() {
  isGameStarted = false;
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

const GAME_TIMEOUT = 15000;
let currentPoints = 0, topPoints = 0, isGameStarted = false;
const lines = document.getElementsByClassName('hole');
const bubbles = document.getElementsByClassName('bubble');
const startButton = document.querySelector('.startButton');
const scoreboard = document.getElementById('currentScoreView');
const bestScore = document.getElementById('topScoreView');

for (let bubble of bubbles) {
  bubble.addEventListener('click', handleBubbleClick);
}
topPoints = loadTopScore();
updateTopScore();
startButton.addEventListener('click', startGame);
