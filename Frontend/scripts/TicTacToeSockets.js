import socket from "./socket.js";

const TicTacToeEvent = {
    START_GAME: "start game",
    MAKE_MOVE: "make move",
    UPDATE_BOARD: "update board",
    GAME_OVER: "game over",
    ERROR: "error",
};

let ongoingGame = false;

// maybe do like a prefered on each side and they have their own letter

document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-container");
    const grid = document.getElementById("game-grid").children;

    board.style.display = "none";

    socket.on("updateGame", (payload) => {
        if (ongoingGame == false) {
            startGame();
        }
        socket.emit("setGameId", payload.gameId);
        drawBoard(payload.board);
    });

    socket.on("gameOver", (winner) => {
        const winnerStr = winner || "Nobody";

        endGame(winnerStr);
    });

    for (let index = 0; index < grid.length; index++) {
        const element = grid[index];
        element.addEventListener("click", (event) => {
            if (ongoingGame) {
                makeMove(index);
            }
        });
    }
});

/**
 * should take the array of strings and fill the game grid
 * @param {string[]} board
 */
function drawBoard(board) {
    const grid = document.getElementById("game-grid").children;
    for (let i = 0; i < board.length; i++) {
        if (board[i]) grid[i].textContent = board[i];
    }
}

function showBoard() {
    document.getElementById("game-container").style.display = "block";
}

function makeMove(index) {
    socket.emit("gameMakeMove", index);
}

function startGame() {
    ongoingGame = true;
    showBoard();
}

function endGame(winner) {
    alert(`${winner} won the game`);
    ongoingGame = false;
    // document.getElementById("game-container").style.display = "none";
}
