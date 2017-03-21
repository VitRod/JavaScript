'use strict';

function rand(from, to) {
  return Math.floor((to - from + 1) * Math.random()) + from;
}

function getRandomBubble() {
  return lines[rand(0, lines.length - 1)];
}

function showButton() {
  startButton.style.display = 'initial';
}

function hideButton() {
  startButton.style.display = 'none';
}

function showBubble(line) {
  line.classList.add('up');
}

function hideBubble(line) {
  line.classList.remove('up');
}

function nextBubble() {
  const bubble = getRandomBubble();
  showBubble(bubble);
  setTimeout(() => {
    hideBubble(bubble);
    nextBubble();
  }, 2000);
}

const lines = document.getElementsByClassName('hole');
const startButton = document.querySelector('.startButton');

startButton.addEventListener('click', () => {
  hideButton();
  nextBubble();
});
