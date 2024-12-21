// Получение элементов DOM
const inputSize = document.getElementById('inputSize');
const form = document.querySelector('form');
const boardElement = document.getElementById('gameBoard');
const countOutput = document.querySelector('h2');
const inputWin = document.getElementById('inputWin');

let size;
let win;
let currentPlayer;
let moves;
let gameOver;
let counter = 1;
let board = [];

// Обработчик кнопки "Начать игру"
form.addEventListener('submit', (event) => {
  event.preventDefault();
  size = parseInt(inputSize.value);
  win = parseInt(inputWin.value);

  if (isNaN(size) || size <= 0) {
    alert('Пожалуйста, введите корректный размер поля.');
    return;
  }

  if (isNaN(win) || win <= 0 || win > size) {
    win = size;
  }

  if (size > 65) {
    alert('Размер поля слишком велик. Выберите размер не более 65.');
    return;
  }

  initializeGame();
});

// Создание игровой доски
const createBoard = () => {
  boardElement.style.setProperty('--size', size);
  boardElement.innerHTML = '';

  board = new Array(size * size).fill('');

  document.querySelector('form').style.display = "none";
  boardElement.style.display = "flex";
  counterOutput();

  board.forEach((_, index) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('click', () => makeMove(index));
    board[index] = cell;
    boardElement.appendChild(cell);
  });
};

// Обновление счётчика хода
const counterOutput = () => {
  countOutput.textContent = `Ход номер ${counter}, ходит ${currentPlayer}.`;
};

// Кнопка "Переиграть"
const createRestartButton = () => {
  const btn = document.createElement('button');
  btn.className = 'reset';
  btn.textContent = 'Переиграть';
  btn.addEventListener('click', () => {
    document.querySelector('form').style.display = "block";
    btn.remove();
    boardElement.style.display = "none";
    countOutput.textContent = '';
    counter = 1;
  });

  const wrapper = document.querySelector('.wrapper');
  wrapper.appendChild(btn);
};

// Обработка хода игрока
const makeMove = (index) => {
  if (gameOver || board[index].textContent !== '') return;

  board[index].textContent = currentPlayer;
  counter++;
  moves++;

  if (checkWin(index)) {
    gameOver = true;
    countOutput.textContent = `На ${counter - 1} ходу выиграл ${currentPlayer}!`;
    return;
  }

  if (moves === size * size) {
    gameOver = true;
    countOutput.textContent = `На ${counter - 1} ходу все клетки заполнены. Ничья.`;
    return;
  }

  currentPlayer = getNextPlayer();
  counterOutput();
};

// Смена игрока
const getNextPlayer = () => {
  return currentPlayer === '✖' ? '⊙' : '✖';
};

// Проверка на выигрыш
const checkWin = (index) => {
  const symbol = board[index].textContent;
  const row = Math.floor(index / size);
  const col = index % size;

  // Проверка строки
  if (checkLine(row * size, 1)) return true;

  // Проверка столбца
  if (checkLine(col, size)) return true;

  // Проверка главной диагонали
  if (checkDiagonal(row, col, 1, 1)) return true;

  // Проверка побочной диагонали
  if (checkDiagonal(row, col, 1, -1)) return true;

  return false;

  function checkLine(start, step) {
    let count = 0;
    for (let i = 0; i < size; i++) {
      const cell = board[start + i * step];
      if (cell && cell.textContent === symbol) {
        count++;
        if (count === win) return true;
      } else {
        count = 0;
      }
    }
    return false;
  }

  function checkDiagonal(row, col, rowStep, colStep) {
    let count = 0;
    let startRow = row;
    let startCol = col;

    while (startRow >= 0 && startCol >= 0 && startCol < size) {
      startRow -= rowStep;
      startCol -= colStep;
    }

    startRow += rowStep;
    startCol += colStep;

    while (startRow < size && startCol >= 0 && startCol < size) {
      const cellIndex = startRow * size + startCol;
      if (board[cellIndex] && board[cellIndex].textContent === symbol) {
        count++;
        if (count === win) return true;
      } else {
        count = 0;
      }
      startRow += rowStep;
      startCol += colStep;
    }

    return false;
  }
};

// Инициализация игры
const initializeGame = () => {
  currentPlayer = '✖';
  moves = 0;
  gameOver = false;
  createBoard();
  createRestartButton();
};
