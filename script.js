let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = 'player';  // Standaardmodus: tegen een vriend

// Start het spel en kies de modus
function startGame(mode) {
    gameMode = mode;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
}

// Maak een zet
function makeMove(index) {
    if (board[index] === '') {
        board[index] = currentPlayer;
        document.querySelectorAll('.cell')[index].innerText = currentPlayer;
        if (checkWin()) {
            alert(currentPlayer + ' 𝓱𝓪𝓼 𝔀𝓸𝓷!');
            resetGame();
        } else if (!board.includes('')) {
            alert('𝓘𝓽 𝓲𝓼 𝓪 𝓽𝓲𝓮!');
            resetGame();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (gameMode === 'ai' && currentPlayer === 'O') {
                aiMove();
            }
        }
    }
}

// Zet van de AI
function aiMove() {
    let emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(randomCell);
}

// Controleer of iemand heeft gewonnen
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Horizontale rijen
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Verticale kolommen
        [0, 4, 8], [2, 4, 6]              // Diagonalen
    ];

    return winPatterns.some(pattern => {
        return board[pattern[0]] === currentPlayer &&
               board[pattern[1]] === currentPlayer &&
               board[pattern[2]] === currentPlayer;
    });
}

// Reset het spel en het bord
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    document.querySelectorAll('.cell').forEach(cell => cell.innerText = '');
    document.getElementById('game').style.display = 'block';  // Zorg dat het bord zichtbaar blijft na reset
}

// Opgeven functie: Terug naar het menu en reset het bord
function giveUp() {
    resetGame();
    document.getElementById('game').style.display = 'none';
    document.getElementById('menu').style.display = 'block';  // Terug naar het hoofdmenu
}

// Laat de "How to Play" modal zien
function showHowToPlay() {
    const howToPlayText = 
        "Tic-Tac-Toe is een spel voor twee spelers. Elke speler kiest om beurten een vakje. " + 
        "Het doel is om drie van je symbolen op een rij te krijgen, horizontaal, verticaal, of diagonaal.";
    document.getElementById('howToPlayModal').style.display = 'block';
    document.getElementById('howToPlayText').innerText = howToPlayText;
}

// Sluit de "How to Play" modal
function closeHowToPlay() {
    document.getElementById('howToPlayModal').style.display = 'none';
}
