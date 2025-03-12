import socket from "./socket.js";

const TicTacToeEvent = {
    START_GAME: "start game",
    MAKE_MOVE: "make move",
    UPDATE_BOARD: "update board",
    GAME_OVER: "game over",
    ERROR: "error",
};

let ongoingGame = false;
let currentPlayer = 'X';

// maybe do like a prefered on each side and they have their own letter

document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-front");
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
    const lobby = JSON.parse(localStorage.getItem("lobby"));

    if (!lobby || lobby.users.length !== 2) return;

    const hostId = lobby.host;
    const players = lobby.users;
    
    const hostPlayer = players.find(user => user.id === hostId);
    const otherPlayer = players.find(user => user.id !== hostId);

    if (!hostPlayer || !otherPlayer) return;

    for (let i = 0; i < board.length; i++) {
        if (board[i] == hostPlayer.id.toString()) {
            grid[i].textContent = "X";
            grid[i].classList.add("x-mark"); 
        } else if (board[i] == otherPlayer.id.toString()) {
            grid[i].textContent = "O";
            grid[i].classList.add("o-mark"); 
        } else {
            grid[i].textContent = "";
        }
    }
}

function showBoard() {
    document.getElementById("game-front").style.display = "block";
    document.getElementById("home-front").style.display = "none";
}



function makeMove(index) {
    if (!ongoingGame) return;
    socket.emit("gameMakeMove", index);
    switchTurn();
}

function startGame() {
    ongoingGame = true;
    showBoard();

    const lobby = JSON.parse(localStorage.getItem("lobby"));
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!lobby || !currentUser || lobby.users.length !== 2) return;

    const hostId = lobby.host;
    const players = lobby.users;


    const hostPlayer = players.find(user => user.id === hostId);
    const otherPlayer = players.find(user => user.id !== hostId);

    if (!hostPlayer || !otherPlayer) return;

    document.querySelector(".player-x").textContent = `${hostPlayer.username} (X)`;
    document.querySelector(".player-o").textContent = `${otherPlayer.username} (O)`;
    document.getElementById("player-1").textContent = `${hostPlayer.username} (X)`;
        document.getElementById("player-2").textContent = `${otherPlayer.username} (O)`;

    if (currentUser.id === hostId) {
        playerSymbol = "X";
        opponentSymbol = "O";
    } else {
        playerSymbol = "O";
        opponentSymbol = "X";
    }
}

function endGame(winner) {
    alert(`${winner} won the game`);
    ongoingGame = false;
    // document.getElementById("game-container").style.display = "none";
}


function switchTurn() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnHighlight();

    
    const playerColor = currentPlayer === 'X' ? 'rgba(0, 123, 255, 0.6)' : 'rgba(255, 99, 71, 0.6)';
    socket.emit("updatePlayerTurn", { player: currentPlayer, color: playerColor });
}

function updateTurnHighlight() {
    const gameContainer = document.getElementById('game-container');

    if (currentPlayer === 'X') {
        gameContainer.style.boxShadow = '0px 0px 30px 10px rgba(0, 123, 255, 0.6)';
    } else {
        gameContainer.style.boxShadow = '0px 0px 30px 10px rgba(255, 99, 71, 0.6)';
    }
}