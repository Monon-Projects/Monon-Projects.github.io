const board = document.getElementById('board');
let selectedPiece = null;

// Helper to check for even or odd row
function isOddRow(index) {
    return Math.floor(index / 8) % 2 !== 0;
}

// Create the board
function createBoard() {
    for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';

        // Assign dark and light cells
        if ((i % 2 === 0 && isOddRow(i)) || (i % 2 !== 0 && !isOddRow(i))) {
            cell.classList.add('dark');

            // Place pieces in starting positions
            if (i < 24) {
                const piece = document.createElement('div');
                piece.className = 'piece black';
                cell.appendChild(piece);
            } else if (i >= 40) {
                const piece = document.createElement('div');
                piece.className = 'piece red';
                cell.appendChild(piece);
            }
        } else {
            cell.classList.add('light');
        }

        board.appendChild(cell);
    }
}

// Drag and drop functionality
board.addEventListener('click', (e) => {
    const targetCell = e.target;

    // Select a piece
    if (targetCell.classList.contains('piece')) {
        selectedPiece = targetCell;
    }
    // Move a piece to a valid dark cell
    else if (selectedPiece && targetCell.classList.contains('dark') && !targetCell.firstChild) {
        const startCell = selectedPiece.parentElement;
        const startIndex = Array.from(board.children).indexOf(startCell);
        const targetIndex = Array.from(board.children).indexOf(targetCell);

        // Calculate if it's a valid move
        const isMoveValid = Math.abs(startIndex - targetIndex) === 7 || Math.abs(startIndex - targetIndex) === 9;
        const isCapture = Math.abs(startIndex - targetIndex) === 14 || Math.abs(startIndex - targetIndex) === 18;

        if (isMoveValid) {
            targetCell.appendChild(selectedPiece);
            selectedPiece = null;
        } else if (isCapture) {
            const jumpedIndex = (startIndex + targetIndex) / 2;
            const jumpedCell = board.children[jumpedIndex];
            if (jumpedCell.firstChild && jumpedCell.firstChild.className !== selectedPiece.className) {
                targetCell.appendChild(selectedPiece);
                jumpedCell.removeChild(jumpedCell.firstChild); // Remove the captured piece
                selectedPiece = null;
            }
        }
    }
});

// Initialize the board
createBoard();
