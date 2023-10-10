let currentPlayer = 1; // Current player / first player is human

let ROWS = 0;
let COLS = 0; 

let MODE = "";
let LEVEL = "";

let matrixGame = []; // Matrix to store value of gomoku move: 0 for empty, 1 for human (X), 2 for computer (O)

let DEPTH = 0; // Depth use in minimax

// Win score should be greater than all possible board scores
const WIN_SCORE = 100000000;
