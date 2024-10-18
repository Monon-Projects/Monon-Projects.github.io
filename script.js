const boardSize = 3;
let currentPlayer = 'X';
let superBoard = [];
let gameActive = true;

const superBoardElement = document.getElementById('super-board');
const messageDisplay = document.getElementById('message');
const resetButton = document.getElementById('reset-button');

function createSuperBoard() {
    superBoard = Array(boardSize).fill(null).map(() => 
        Array(boardSize).fill(null).map(() => Array(boardSize).fill(''))
    );
    
    superBoardElement.innerHTML = '';
    
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const subBoard = document.createElement('div');
            subBoard.classList.add('sub-board');
            subBoard.dataset.row = row;
            subBoard.dataset.col = col;

            for (let subRow = 0; subRow < boardSize; subRow++) {
                for (let subCol = 0; subCol < boardSize; subCol++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    cell.dataset.subRow = subRow;
                    cell.dataset.subCol = subCol;
                    cell.addEventListener('click', handleCellClick);
                    subBoard.appendChild(cell);
                }
            }

            superBoardElement.appendChild(subBoard);
        }
    }
}

function handleCellClick(event) {
    if (!gameActive) return;
    
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    const subRow = event.target.dataset.subRow;
    const subCol = event.target.dataset.subCol;

    if (superBoard[row][col][subRow][subCol] === '') {
        superBoard[row][col][subRow][subCol] = currentPlayer;
        event.target.textContent = currentPlayer;
        
        if (checkWin(superBoard[row][col])) {
            messageDisplay.textContent = `${currentPlayer} wins in sub-board [${row}, ${col}]!`;
            disableSubBoard(row, col);
        } else if (checkSuperWin()) {
            gameActive = false;
            messageDisplay.textContent = `${currentPlayer} wins the game!`;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function checkWin(subBoard) {
    for (let i = 0; i < boardSize; i++) {
        // Check rows and columns
        if (subBoard[i][0] && subBoard[i].every(cell => cell === subBoard[i][0])) return true;
        if (subBoard[0][i] && subBoard.every(row => row[i] === subBoard[0][i])) return true;
    }

    // Check diagonals
    if (subBoard[0][0] && subBoard.every((row, i) => row[i] === subBoard[0][0])) return true;
    if (subBoard[0][boardSize - 1] && subBoard.every((row, i) => row[boardSize - 1 - i] === subBoard[0][boardSize - 1])) return true;

    return false;
}

function checkSuperWin() {
    for (let i = 0; i < boardSize; i++) {
        // Check rows and columns in the super board
        if (superBoard[i][0] && superBoard[i].every(board => board.every(row => row.every(cell => cell === currentPlayer)))) return true;
        if (superBoard[0][i] && superBoard.every(board => board[i].every(row => row.every(cell => cell === currentPlayer)))) return true;
    }

    // Check diagonals in the super board
    if (superBoard[0][0] && superBoard.every((board, i) => board[i].every(row => row.every(cell => cell === currentPlayer)))) return true;
    if (superBoard[0][boardSize - 1] && superBoard.every((board, i) => board[boardSize - 1 - i].every(row => row.every(cell => cell === currentPlayer)))) return true;

    return false;
}

function disableSubBoard(row, col) {
    const subBoard = document.querySelectorAll(`[data-row='${row}'][data-col='${col}'] .cell`);
    subBoard.forEach(cell => {
        cell.classList.add('disabled');
        cell.removeEventListener('click', handleCellClick);
    });
}

resetButton.addEventListener('click', () => {
    gameActive = true;
    currentPlayer = 'X';
    messageDisplay.textContent = '';
    createSuperBoard();
});

// Initialize the super board on load
createSuperBoard();
