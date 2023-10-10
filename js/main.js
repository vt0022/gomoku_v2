// Start the game
document.addEventListener("DOMContentLoaded", function () {
    configGame();

    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", checkInput);
});

function humanMove(cell) {
    if (!cell.textContent) {
        // Display move
        cell.textContent = currentPlayer === 1 ? "X" : "O";
        cell.style.color = currentPlayer === 1 ? "green" : "red";
        // Update game matrix
        matrixGame[cell.dataset.row][cell.dataset.column] = currentPlayer;

        // Check if winning
        if (checkWin([cell.dataset.row, cell.dataset.column], currentPlayer)) {
            alert("Người chơi " + cell.textContent + " thắng!");
            refreshGame();
        }
        // Check if tie
        else if (checkTie()) {
            alert("Hoà rồi!!!");
            refreshGame();
        } else {
            // Change player
            currentPlayer = currentPlayer === 1 ? 2 : 1;

            // If player choose to duo with bot
            if (MODE === "computer") {
                computerMove();
            }
        }
    }
}

function computerMove() {
    // Function to get move
    let move = calculateNextMove(DEPTH);

    const cell = document.querySelector(`[data-row="${move[0]}"][data-column="${move[1]}"]`);

    // Display move
    cell.textContent = currentPlayer === 1 ? "X" : "O";
    cell.style.color = currentPlayer === 1 ? "green" : "red";
    // Update game matrix
    matrixGame[cell.dataset.row][cell.dataset.column] = currentPlayer;

    // Check if winning
    if (checkWin([cell.dataset.row, cell.dataset.column], currentPlayer)) {
        alert("Bạn thua rồi!!!");
        refreshGame();
    }
    // Check if tie
    else if (checkTie()) {
        alert("Hoà rồi!!!");
        refreshGame();
    } else {
        // Đổi người
        currentPlayer = currentPlayer === 1 ? 2 : 1; // X là người - 1, O là máy - 2
    }
}

function getHorizontal(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
        if (y + i < matrixGame[0].length && matrixGame[x][y + i] === player) {
            count++;
        } else {
            break;
        }
    }

    for (let i = 1; i < 5; i++) {
        if (y - i >= 0 && y - i < matrixGame[0].length && matrixGame[x][y - i] === player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

function getVertical(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
        if (x + i < matrixGame.length && matrixGame[x + i][y] === player) {
            count++;
        } else {
            break;
        }
    }

    for (let i = 1; i < 5; i++) {
        if (x - i >= 0 && x - i < matrixGame.length && matrixGame[x - i][y] === player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

function getRightDiagonal(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
        if (x - i >= 0 && x - i < matrixGame.length && y + i < matrixGame[0].length && matrixGame[x - i][y + i] === player) {
            count++;
        } else {
            break;
        }
    }

    for (let i = 1; i < 5; i++) {
        if (x + i < matrixGame.length && y - i >= 0 && y - i < matrixGame[0].length && matrixGame[x + i][y - i] === player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

function getLeftDiagonal(x, y, player) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
        if (x - i >= 0 && x - i < matrixGame.length && y - i >= 0 && y - i < matrixGame[0].length && matrixGame[x - i][y - i] === player) {
            count++;
        } else {
            break;
        }
    }

    for (let i = 1; i < 5; i++) {
        if (x + i < matrixGame.length && y + i < matrixGame[0].length && matrixGame[x + i][y + i] === player) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

function checkWin(points, player) {
    return getHorizontal(Number(points[0]), Number(points[1]), player) >= 5 || getVertical(Number(points[0]), Number(points[1]), player) >= 5 || getRightDiagonal(Number(points[0]), Number(points[1]), player) >= 5 || getLeftDiagonal(Number(points[0]), Number(points[1]), player) >= 5;
}

function checkTie() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (matrixGame[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}
