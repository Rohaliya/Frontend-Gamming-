document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('resetBtn');
    const modeButtons = document.querySelectorAll('.mode-button');
    const difficultyButtons = document.querySelectorAll('.difficulty-button');
    const userWinsDisplay = document.getElementById('userWins');
    const computerWinsDisplay = document.getElementById('computerWins');
    const drawsDisplay = document.getElementById('draws');

    let currentPlayer = 'X';
    let cells = ['', '', '', '', '', '', '', '', ''];
    let gameEnded = false;
    let isUserVsComputer = false;
    let difficulty = 'easy';
    let userWins = 0;
    let computerWins = 0;
    let draws = 0;

    // Initialize the game board
    function initBoard() {
        for (let i = 0; i < 9; i++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', cellClickHandler);
            board.appendChild(cell);
            if ((i + 1) % 3 === 0) {
                board.appendChild(document.createElement('div')).className = 'row';
            }
        }
    }

    // Reset the game
    function resetGame() {
        currentPlayer = 'X';
        cells = ['', '', '', '', '', '', '', '', ''];
        gameEnded = false;
        status.textContent = '';
        board.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner');
        });
        if (isUserVsComputer && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }

    // Handle cell click
    function cellClickHandler(event) {
        if (!gameEnded && (!isUserVsComputer || currentPlayer === 'X')) {
            const index = event.target.getAttribute('data-index');
            if (cells[index] === '') {
                cells[index] = currentPlayer;
                event.target.textContent = currentPlayer;
                if (checkWinner()) {
                    if (currentPlayer === 'X') {
                        userWins++;
                        userWinsDisplay.textContent = userWins;
                    } else {
                        computerWins++;
                        computerWinsDisplay.textContent = computerWins;
                    }
                    status.textContent = `Player ${currentPlayer} wins!`;
                    gameEnded = true;
                    board.querySelectorAll('.cell').forEach(cell => {
                        if (cell.textContent === currentPlayer) {
                            cell.classList.add('winner');
                        }
                    });
                    setTimeout(resetGame, 1000);
                } else if (cells.every(cell => cell !== '')) {
                    draws++;
                    drawsDisplay.textContent = draws;
                    status.textContent = "It's a draw!";
                    gameEnded = true;
                    setTimeout(resetGame, 1000);
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    status.textContent = `Player ${currentPlayer}'s turn`;
                    if (isUserVsComputer && currentPlayer === 'O') {
                        setTimeout(computerMove, 500);
                    }
                }
            }
        }
    }

    // Computer move
    function computerMove() {
        if (!gameEnded) {
            let index;

            // First, check if there's a winning move
            for (let i = 0; i < 9; i++) {
                if (cells[i] === '') {
                    cells[i] = currentPlayer;
                    if (checkWinner()) {
                        index = i;
                        break;
                    }
                    cells[i] = ''; // Undo the move
                }
            }

            // If no winning move, try to block the player's winning move
            if (index === undefined) {
                for (let i = 0; i < 9; i++) {
                    if (cells[i] === '') {
                        cells[i] = currentPlayer === 'X' ? 'O' : 'X';
                        if (checkWinner()) {
                            cells[i] = currentPlayer;
                            index = i;
                            break;
                        }
                        cells[i] = ''; // Undo the move
                    }
                }
            }

            // If no winning or blocking move, make a random move
            if (index === undefined) {
                do {
                    index = Math.floor(Math.random() * 9);
                } while (cells[index] !== '');
            }

            cells[index] = currentPlayer;
            board.querySelector(`.cell[data-index="${index}"]`).textContent = currentPlayer;
            if (checkWinner()) {
                computerWins++;
                computerWinsDisplay.textContent = computerWins;
                status.textContent = `Computer wins!`;
                gameEnded = true;
                setTimeout(resetGame, 1000);
            } else if (cells.every(cell => cell !== '')) {
                draws++;
                drawsDisplay.textContent = draws;
                status.textContent = "It's a draw!";
                gameEnded = true;
                setTimeout(resetGame, 1000);
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                status.textContent = `Player ${currentPlayer}'s turn`;
            }
        }
    }

    // Check if there's a winner
    function checkWinner() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const condition of winConditions) {
            const [a, b, c] = condition;
            if (cells[a] !== '' && cells[a] === cells[b] && cells[a] === cells[c]) {
                return true;
            }
        }

        return false;
    }

    // Initialize the game
    initBoard();

    // Event listener for reset button
    resetBtn.addEventListener('click', resetGame);

    // Event listener for mode selection
    modeButtons.forEach(button => {
        button.addEventListener('click', function () {
            modeButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            isUserVsComputer = this.getAttribute('data-mode') === 'computer';
            resetGame();
        });
    });

    // Event listener for difficulty level selection
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function () {
            difficultyButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            difficulty = this.getAttribute('data-difficulty');
            if (isUserVsComputer && currentPlayer === 'O') {
                setTimeout(computerMove, 500);
            }
        });
    });
});
