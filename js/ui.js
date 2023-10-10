// Apply mode to play with computer
function applyMode() {
    if (LEVEL === "easy") {
        DEPTH = 2;
    } else if (LEVEL === "medium") {
        DEPTH = 3;
    } else if (LEVEL === "hard") {
        DEPTH = 4;
    }
}

// Selection
function configGame() {
    // Get mode and level
    const modeOption = document.getElementById("mode");
    const levelOption = document.getElementById("level");
    MODE = modeOption.value;
    LEVEL = levelOption.value;

    // Add an event listener to the "mode" select element
    modeOption.addEventListener("change", function () {
        // Check if the selected option is "bot"
        if (modeOption.value === "computer") {
            // If "computer" is selected, show the mode
            levelOption.style.display = "block";
            levelOption.style.margin = "0 auto";
        } else {
            // If any other option is selected, hide the mode
            levelOption.style.display = "none";
        }
        MODE = modeOption.value;
    });

    // Add an event listener to the "level" select element
    levelOption.addEventListener("change", function () {
        LEVEL = levelOption.value;
    });
}

// Create main board
function initializeBoard() {
    // Apply map with mode
    applyMode();

    const board = document.getElementById("board");
    board.innerHTML = "";

    // Get size and display
    COLS = document.getElementById("column-size").value;
    ROWS = document.getElementById("row-size").value;

    document.documentElement.style.setProperty("--column-size", COLS);
    document.documentElement.style.setProperty("--row-size", ROWS);

    // Hide the input element
    document.getElementById("board-input").style.display = "none";

    // Display button new game
    var newGameButton = document.querySelector(".new-game");
    newGameButton.style.display = "inline-block";
    newGameButton.addEventListener("click", () => location.reload());

    // Display button reset game
    var resetGameButton = document.querySelector(".reset-game");
    resetGameButton.style.display = "inline-block";
    resetGameButton.addEventListener("click", () => refreshGame());

    // Create matrix to store
    for (let i = 0; i < ROWS; i++) {
        matrixGame[i] = [];
        for (let j = 0; j < COLS; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = i;
            cell.dataset.column = j;
            cell.addEventListener("click", () => humanMove(cell));
            board.appendChild(cell);
            matrixGame[i][j] = 0;
        }
    }
}

function refreshGame() {
    // Reset player
    currentPlayer = 1; // first player

    // Reset board
    initializeBoard();
}

function checkInput(event) {
    // Get references to the input fields
    const columnSizeInput = document.getElementById("column-size");
    const rowSizeInput = document.getElementById("row-size");

    // Get the values of the input fields
    const columnSizeValue = columnSizeInput.value.trim();
    const rowSizeValue = rowSizeInput.value.trim();

    // Check if the input values are empty or invalid
    if (columnSizeValue === "" || rowSizeValue === "") {
        // Prevent the form from submitting
        event.preventDefault();

        // Show an error message (you can customize this part)
        alert("Vui lòng điền đầy đủ thông tin cột và hàng!");

        // Optionally, you can focus on the first empty input field
        if (columnSizeValue === "") {
            columnSizeInput.focus();
        } else {
            rowSizeInput.focus();
        }
    } else {
        // Proceed with initializing the game
        initializeBoard();
    }
}
