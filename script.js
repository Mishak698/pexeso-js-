const gameBoard = document.getElementById('game-board');
const turnInfo = document.getElementById('turn-info');
const attemptsInfo = document.getElementById('attempts-info');
const startBtn = document.getElementById('start-btn');
const playersSelect = document.getElementById('players');

const cards = [
  '🍎', '🍌', '🍇', '🍓',
  '🍎', '🍌', '🍇', '🍓',
  '🍒', '🍍', '🍉', '🥝',
  '🍒', '🍍', '🍉', '🥝'
];

let playerCount;
let currentPlayer = 0;
let playersAttempts = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;


startBtn.addEventListener('click', startGame);

function startGame() {
  playerCount = parseInt(playersSelect.value);
  playersAttempts = Array(playerCount).fill(0);
  currentPlayer = 0;
  matchedPairs = 0;
  gameBoard.innerHTML = ''; // Vyprázdní desku
  turnInfo.textContent = `Na tahu: Hráč ${currentPlayer + 1}`;
  updateAttempts();


  cards.sort(() => 0.5 - Math.random());

  cards.forEach((symbol) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;

    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}


function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add('flipped');
  this.textContent = this.dataset.symbol;

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    checkMatch();
  }
}


function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    checkWin();
    resetBoard();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.textContent = '';
      secondCard.textContent = '';
      resetBoard();
    }, 1000);
  }


  playersAttempts[currentPlayer]++;
  updateAttempts();
  switchPlayer();
}


function switchPlayer() {
  currentPlayer = (currentPlayer + 1) % playerCount;
  turnInfo.textContent = `Na tahu: Hráč ${currentPlayer + 1}`;
}


function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}


function updateAttempts() {
  attemptsInfo.textContent = playersAttempts
    .map((attempts, index) => `Hráč ${index + 1}: ${attempts} pokusů`)
    .join(' | ');
}

function checkWin() {
  if (matchedPairs === cards.length / 2) {
    const winner = playersAttempts.indexOf(Math.min(...playersAttempts));
    setTimeout(() => alert(`Hra skončila! Vyhrál Hráč ${winner + 1} s ${playersAttempts[winner]} pokusy!`), 500);
  }
}
