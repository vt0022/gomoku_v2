// This variable is used to track the number of evaluations for benchmarking purposes.
let evaluationCount = 0;
// Win score should be greater than all possible board scores
const WIN_SCORE = 100000000;

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

// This function is used for mark a temporary move on the matrix to use for minimax
function markMove(matrix, x, y, isHuman) {
    matrix[y][x] = isHuman ? 1 : 2; // Human is 1, computer is 2
    // 0: Empty 1: X 2: O
}

// This function is used for rollback mark action above
function unmarkMove(matrix, x, y) {
    matrix[y][x] = 0; // Human is 1, computer is 2
    // 0: Empty 1: X 2: O
}

// This function is used for creating a copy matrix so as not to affect original matrix (matrixGame)
function copyMatrix(matrix) {
    var boardMatrix = [];
    for (var i = 0; i < matrix.length; i++) {
        boardMatrix[i] = matrix[i].slice(); // Sử dụng phương thức slice() để sao chép mảng con
    }
    return boardMatrix;
}

function generateMoves(matrix) {
    let moveList = [];

    // Look for cells that has at least one stone in an adjacent cell.
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (matrix[i][j] > 0) continue; // Increase j --> this is marked

            if (i > 0) {
                if (j > 0) {
                    if (matrix[i - 1][j - 1] > 0 || matrix[i][j - 1] > 0) {
                        // Up left and top are blocked
                        let move = [i, j];
                        moveList.push(move);
                        continue;
                    }
                }
                if (j < COLS - 1) {
                    if (matrix[i - 1][j + 1] > 0 || matrix[i][j + 1] > 0) {
                        // Up right or right is blocked
                        let move = [i, j];
                        moveList.push(move);
                        continue;
                    }
                }
                if (matrix[i - 1][j] > 0) {
                    // Left is blocked
                    let move = [i, j];
                    moveList.push(move);
                    continue;
                }
            }
            if (i < ROWS - 1) {
                if (j > 0) {
                    if (matrix[i + 1][j - 1] > 0 || matrix[i][j - 1] > 0) {
                        // Down left or left is blocked
                        let move = [i, j];
                        moveList.push(move);
                        continue;
                    }
                }
                if (j < COLS - 1) {
                    if (matrix[i + 1][j + 1] > 0 || matrix[i][j + 1] > 0) {
                        // Down right or right is blocked
                        let move = [i, j];
                        moveList.push(move);
                        continue;
                    }
                }
                if (matrix[i + 1][j] > 0) {
                    // Bottom is blocked
                    let move = [i, j];
                    moveList.push(move);
                    continue;
                }
            }
        }
    }

    return moveList;
}

// This function calculates the relative score of the O player against the X.
// (i.e. how likely is O player to win the game before the X player)
// This value will be used as the score in the Minimax algorithm.
function evaluateMatrixForComputer(matrix, isHumanTurn) {
    evaluationCount++;

    // Get matrix score of both players.
    let humanScore = getScore(matrix, true, isHumanTurn);
    let computerScore = getScore(matrix, false, isHumanTurn);

    if (humanScore === 0) humanScore = 1.0;

    // Calculate relative score of computer against human
    return computerScore / humanScore;
}

// This function calculates the matrix score of the specified player.
// (i.e. How good a player's general standing on the board by considering how many
//  consecutive 2's, 3's, 4's it has, how many of them are blocked etc...)
function getScore(matrix, isForHuman, isHumanTurn) {
    // Read the board
    let boardMatrix = copyMatrix(matrix);

    // Calculate score for each of the 3 directions
    return evaluateHorizontal(boardMatrix, isForHuman, isHumanTurn) + evaluateVertical(boardMatrix, isForHuman, isHumanTurn) + evaluateDiagonal(boardMatrix, isForHuman, isHumanTurn);
}

// This function is used to get the next intelligent move to make for the AI.
function calculateNextMove(depth) {
    let move = new Array(2); // Size 2

    // Check if any available move can finish the game to make sure the AI always
    // takes the opportunity to finish the game.
    let bestMove = searchWinningMove(matrixGame);

    if (bestMove != null) {
        // Finishing move is found.
        move[0] = parseInt(bestMove[1]);
        move[1] = parseInt(bestMove[2]);
    } else {
        // If there is no such move, search the minimax tree with specified depth.
        let dummyMatrix = copyMatrix(matrixGame);
        bestMove = minimaxSearchAB(depth, dummyMatrix, true, -1.0, WIN_SCORE);
        if (bestMove[1] === null) {
            move = null;
        } else {
            move[0] = parseInt(bestMove[1]);
            move[1] = parseInt(bestMove[2]);
        }
    }
    console.log("Cases calculated: " + evaluationCount);

    evaluationCount = 0;

    return move;
}

/*
 * alpha : Best AI Move (Max)
 * beta : Best Player Move (Min)
 * returns: {score, move[0], move[1]}
 * */
function minimaxSearchAB(depth, dummyMatrix, isMax, alpha, beta) {
    // Last depth (terminal node), evaluate the current board score.
    if (depth === 0) {
        let x = [evaluateMatrixForComputer(dummyMatrix, !isMax), null, null];
        return x;
    }

    // Generate all possible moves from this node of the Minimax Tree
    /*
     *                  (Move 1)
     *	               /
     *  (Current Node) --- (Move 2)
     *				   \   ...
     *                  (Move N)
     */
    let allPossibleMoves = generateMoves(dummyMatrix);

    // If there is no possible move left, treat this node as a terminal node and return the score.
    if (allPossibleMoves.length === 0) {
        let x = [evaluateMatrixForComputer(dummyMatrix, !isMax), null, null];
        return x;
    }

    let bestMove = new Array(3); // Size = 3

    // Generate Minimax Tree and calculate node scores.
    if (isMax) {
        // Computer
        // Initialize the starting best move with -infinity.
        bestMove[0] = -1.0;
        // Iterate for all possible moves that can be made.
        for (let move of allPossibleMoves) {
            // Play the move on that temporary board without drawing anything
            markMove(dummyMatrix, move[1], move[0], false);

            // Call the minimax function for the next depth, to look for a minimum score.
            // This function recursively generates new Minimax trees branching from this node
            // (if the depth > 0) and searches for the minimum white score in each of the sub trees.
            // We will find the maximum score of this depth, among the minimum scores found in the
            // lower depth.
            let tempMove = minimaxSearchAB(depth - 1, dummyMatrix, false, alpha, beta);

            // backtrack and remove
            unmarkMove(dummyMatrix, move[1], move[0]);

            // Updating alpha (alpha value holds the maximum score)
            // When searching for the minimum, if the score of a node is lower than the alpha
            // (max score of uncle nodes from one upper level) the whole subtree originating
            // from that node will be discarded, since the maximizing player will choose the
            // alpha node over any node with a score lower than the alpha.
            if (Number(tempMove[0]) > alpha) {
                alpha = Number(tempMove[0]);
            }
            // Pruning with beta
            // Beta value holds the minimum score among the uncle nodes from one upper level.
            // We need to find a score lower than this beta score, because any score higher than
            // beta will be eliminated by the minimizing player (upper level). If the score is
            // higher than (or equal to) beta, break out of loop discarding any remaining nodes
            // and/or subtrees and return the last move.
            if (Number(tempMove[0]) >= beta) {
                return tempMove;
            }

            // Find the move with the maximum score.
            if (Number(tempMove[0]) > Number(bestMove[0])) {
                bestMove = tempMove;
                bestMove[1] = move[0];
                bestMove[2] = move[1];
            }
        }
    } else {
        // Initialize the starting best move using the first move in the list and +infinity score.
        bestMove[0] = 100000000.0;
        bestMove[1] = allPossibleMoves[0][0];
        bestMove[2] = allPossibleMoves[0][1];

        // Iterate for all possible moves that can be made.
        for (let move of allPossibleMoves) {
            // Create a temporary board that is equivalent to the current board

            // Play the move on that temporary board without drawing anything
            markMove(dummyMatrix, move[1], move[0], true);

            // Call the minimax function for the next depth, to look for a maximum score.
            // This function recursively generates new Minimax trees branching from this node
            // (if the depth > 0) and searches for the maximum white score in each of the sub trees.
            // We will find the minimum score of this depth, among the maximum scores found in the
            // lower depth.
            let tempMove = minimaxSearchAB(depth - 1, dummyMatrix, true, alpha, beta);

            unmarkMove(dummyMatrix, move[1], move[0]);

            // Updating beta (beta value holds the minimum score)
            // When searching for the maximum, if the score of a node is higher than the beta
            // (min score of uncle nodes from one upper level) the whole subtree originating
            // from that node will be discarded, since the minimizing player will choose the
            // beta node over any node with a score higher than the beta.
            if (Number(tempMove[0]) < beta) {
                beta = Number(tempMove[0]);
            }
            // Pruning with alpha
            // Alpha value holds the maximum score among the uncle nodes from one upper level.
            // We need to find a score higher than this alpha score, because any score lower than
            // alpha will be eliminated by the maximizing player (upper level). If the score is
            // lower than (or equal to) alpha, break out of loop discarding any remaining nodes
            // and/or subtrees and return the last move.
            if (Number(tempMove[0]) <= alpha) {
                return tempMove;
            }

            // Find the move with the minimum score.
            if (Number(tempMove[0]) < Number(bestMove[0])) {
                bestMove = tempMove;
                bestMove[1] = move[0];
                bestMove[2] = move[1];
            }
        }
    }

    // Return the best move found in this depth
    return bestMove;
}

// This function looks for a move that can instantly win the game.
function searchWinningMove(matrix) {
    let allPossibleMoves = generateMoves(matrix);
    let winningMove = new Array(3); // Size 3

    // Iterate for all possible moves
    for (let move of allPossibleMoves) {
        evaluationCount++;
        // Create a temporary board that is equivalent to the current board
        let dummyMatrix = copyMatrix(matrix);
        // Play the move on that temporary board without drawing anything
        markMove(dummyMatrix, move[1], move[0], false);

        // If the white player has a winning score in that temporary board, return the move.
        if (getScore(dummyMatrix, false, false) >= WIN_SCORE) {
            winningMove[1] = move[0];
            winningMove[2] = move[1];
            return winningMove;
        }
    }
    return null;
}

// This function calculates the score by evaluating the stone positions in horizontal direction
function evaluateHorizontal(matrix, isForHuman, isPlayersTurn) {
    let evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score
    // blocks variable is used to check if a consecutive stone set is blocked by the opponent or
    // the board border. If the both sides of a consecutive set is blocked, blocks variable will be 2
    // If only a single side is blocked, blocks variable will be 1, and if both sides of the consecutive
    // set is free, blocks count will be 0.
    // By default, first cell in a row is blocked by the left border of the board.
    // If the first cell is empty, block count will be decremented by 1.
    // If there is another empty cell after a consecutive stones set, block count will again be
    // decremented by 1.
    // Iterate over all rows
    for (let i = 0; i < ROWS; i++) {
        // Iterate over all cells in a row
        for (let j = 0; j < COLS; j++) {
            // Check if the selected player has a stone in the current cell
            evaluateDirections(matrix, i, j, isForHuman, isPlayersTurn, evaluations);
        }
        evaluateDirectionsAfterOnePass(evaluations, isForHuman, isPlayersTurn);
    }

    return evaluations[2];
}

// This function calculates the score by evaluating the stone positions in vertical direction
// The procedure is the exact same of the horizontal one.
function evaluateVertical(matrix, isForHuman, isPlayersTurn) {
    let evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score

    for (let j = 0; j < COLS; j++) {
        for (let i = 0; i < ROWS; i++) {
            evaluateDirections(matrix, i, j, isForHuman, isPlayersTurn, evaluations);
        }
        evaluateDirectionsAfterOnePass(evaluations, isForHuman, isPlayersTurn);
    }
    return evaluations[2];
}

// This function calculates the score by evaluating the stone positions in diagonal directions
// The procedure is the exact same of the horizontal calculation.
function evaluateDiagonal(matrix, isForHuman, isPlayersTurn) {
    let evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score
    // From bottom-left to top-right diagonally
    for (let k = 0; k <= 2 * (ROWS - 1); k++) {
        let iStart = Math.max(0, k - ROWS + 1);
        let iEnd = Math.min(ROWS - 1, k);
        for (let i = iStart; i <= iEnd; ++i) {
            evaluateDirections(matrix, i, k - i, isForHuman, isPlayersTurn, evaluations);
        }
        evaluateDirectionsAfterOnePass(evaluations, isForHuman, isPlayersTurn);
    }
    // From top-left to bottom-right diagonally
    for (let k = 1 - ROWS; k < ROWS; k++) {
        let iStart = Math.max(0, k);
        let iEnd = Math.min(ROWS + k - 1, ROWS - 1);
        for (let i = iStart; i <= iEnd; ++i) {
            evaluateDirections(matrix, i, i - k, isForHuman, isPlayersTurn, evaluations);
        }
        evaluateDirectionsAfterOnePass(evaluations, isForHuman, isPlayersTurn);
    }
    return evaluations[2];
}

function evaluateDirections(matrix, i, j, isComputer, isComputerTurn, eval) {
    // Check if the selected player has a stone in the current cell
    if (matrix[i][j] === (isComputer ? 1 : 2)) {
        // Increment consecutive stones count
        eval[0]++;
    }
    // Check if cell is empty
    else if (matrix[i][j] === 0) {
        // Check if there were any consecutive stones before this empty cell
        if (eval[0] > 0) {
            // Consecutive set is not blocked by opponent, decrement block count
            eval[1]--;
            // Get consecutive set score
            eval[2] += getConsecutiveSetScore(eval[0], eval[1], isComputer === isComputerTurn);
            // Reset consecutive stone count
            eval[0] = 0;
            // Current cell is empty, next consecutive set will have at most 1 blocked side.
        }
        // No consecutive stones.
        // Current cell is empty, next consecutive set will have at most 1 blocked side.
        eval[1] = 1;
    }
    // Cell is occupied by opponent
    // Check if there were any consecutive stones before this empty cell
    else if (eval[0] > 0) {
        // Get consecutive set score
        eval[2] += getConsecutiveSetScore(eval[0], eval[1], isComputer === isComputerTurn);
        // Reset consecutive stone count
        eval[0] = 0;
        // Current cell is occupied by opponent, next consecutive set may have 2 blocked sides
        eval[1] = 2;
    } else {
        // Current cell is occupied by opponent, next consecutive set may have 2 blocked sides
        eval[1] = 2;
    }
}

function evaluateDirectionsAfterOnePass(eval, isComputer, isPlayersTurn) {
    // End of row, check if there were any consecutive stones before we reached right border
    if (eval[0] > 0) {
        eval[2] += getConsecutiveSetScore(eval[0], eval[1], isComputer === isPlayersTurn);
    }
    // Reset consecutive stone and blocks count
    eval[0] = 0;
    eval[1] = 2;
}

// This function returns the score of a given consecutive stone set.
// count: Number of consecutive stones in the set
// blocks: Number of blocked sides of the set (2: both sides blocked, 1: single side blocked, 0: both sides free)
function getConsecutiveSetScore(count, blocks, isCurrentTurn) {
    const winGuarantee = 1000000;
    // If both sides of a set is blocked, this set is worthless return 0 points.
    if (blocks === 2 && count < 5) return 0;

    switch (count) {
        case 5: {
            // 5 consecutive wins the game
            return WIN_SCORE;
        }
        case 4: {
            // 4 consecutive stones in the user's turn guarantees a win.
            // (User can win the game by placing the 5th stone after the set)
            if (isCurrentTurn) return winGuarantee;
            else {
                // Opponent's turn
                // If neither side is blocked, 4 consecutive stones guarantees a win in the next turn.
                if (blocks === 0) return winGuarantee / 4;
                // If only a single side is blocked, 4 consecutive stones limits the opponents move
                // (Opponent can only place a stone that will block the remaining side, otherwise the game is lost
                // in the next turn). So a relatively high score is given for this set.
                else return 200;
            }
        }
        case 3: {
            // 3 consecutive stones
            if (blocks === 0) {
                // Neither side is blocked.
                // If it's the current player's turn, a win is guaranteed in the next 2 turns.
                // (User places another stone to make the set 4 consecutive, opponent can only block one side)
                // However the opponent may win the game in the next turn therefore this score is lower than win
                // guaranteed scores but still a very high score.
                if (isCurrentTurn) return 50000;
                // If it's the opponent's turn, this set forces opponent to block one of the sides of the set.
                // So a relatively high score is given for this set.
                else return 200;
            } else {
                // One of the sides is blocked.
                // Playmaker scores
                if (isCurrentTurn) return 10;
                else return 5;
            }
        }
        case 2: {
            // 2 consecutive stones
            // Playmaker scores
            if (blocks === 0) {
                if (isCurrentTurn) return 7;
                else return 5;
            } else {
                return 3;
            }
        }
        case 1: {
            return 1;
        }
    }

    // More than 5 consecutive stones?
    return WIN_SCORE * 2;
}
