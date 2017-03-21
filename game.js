'use strict';

function rand(from, to) {
  return Math.floor((to - from + 1) * Math.random()) + from;
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

const lines = document.getElementsByClassName('hole');
const startButton = document.querySelector('.startButton');

startButton.addEventListener('click', () => {
  hideButton();
  showBubble(lines[rand(0, lines.length - 1)]);
});
