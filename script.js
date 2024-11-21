const board = document.getElementById('board');

// Helper to check even or odd row
function isOddRow(index) {
    return Math.floor(index / 8) % 2 !== 0;
}

// Initialize the board
function createBoard() {
    for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if ((i % 2 === 0 && isOddRow(i)) || (i % 2 !== 0 && !isOddRow(i))) {
            if (i < 24) {
                const piece = document.createElement('div');
                piece.className = 'piece black';
                cell.appendChild(piece);
            } else if (i >= 40) {
                const piece = document.createElement('div');
                piece.className = 'piece red';
                cell.appendChild(piece);
            }
        }
        board.appendChild(cell);
    }
}

createBoard();

// Drag and drop functionality
let selectedPiece = null;

board.addEventListener('click', (e) => {
    if (e.target.classList.contains('piece')) {
        selectedPiece = e.target;
    } else if (selectedPiece && e.target.classList.contains('cell')) {
        e.target.appendChild(selectedPiece);
        selectedPiece = null;
    }
});
