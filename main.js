const boardSize = 10;
const winLength = 5;
let currentPlayer = 'X';
let board = [];
let gameActive = true;

const gameBoard = document.getElementById('game-board');
const messageDisplay = document.getElementById('message');
const resetButton = document.getElementById('reset-button');

function createBoard() {
    board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(''));
    gameBoard.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (!gameActive) return;
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (board[row][col] === '') {
        board[row][col] = currentPlayer;
        event.target.textContent = currentPlayer;
        if (checkWin(row, col)) {
            gameActive = false;
            messageDisplay.textContent = `${currentPlayer} wins!`;
        } else if (board.flat().every(cell => cell !== '')) {
            messageDisplay.textContent = 'It\'s a draw!';
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function checkWin(row, col) {
    row = parseInt(row);
    col = parseInt(col);

    function checkDirection(deltaRow, deltaCol) {
        let count = 0;
        let r = row, c = col;
        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === currentPlayer) {
            count++;
            r += deltaRow;
            c += deltaCol;
        }
        return count;
    }

    const directions = [
        [[0, 1], [0, -1]],  // Horizontal
        [[1, 0], [-1, 0]],  // Vertical
        [[1, 1], [-1, -1]], // Diagonal (top-left to bottom-right)
        [[1, -1], [-1, 1]]  // Diagonal (bottom-left to top-right)
    ];

    for (const [[deltaRow1, deltaCol1], [deltaRow2, deltaCol2]] of directions) {
        const count = checkDirection(deltaRow1, deltaCol1) + checkDirection(deltaRow2, deltaCol2) - 1;
        if (count >= winLength) return true;
    }

    return false;
}

resetButton.addEventListener('click', () => {
    gameActive = true;
    currentPlayer = 'X';
    messageDisplay.textContent = '';
    createBoard();
});

// Initialize the game board on load
createBoard();
