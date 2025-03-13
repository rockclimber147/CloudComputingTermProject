import socket from "./socket.js";

let ongoingGame = false;
let currentTurnId;
let xPlayer;
let yPlayer;

document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-front");
    const grid = document.getElementById("game-grid").children;

    board.style.display = "none";

    socket.on("updateGame", (payload) => {
        if (ongoingGame == false) {
            startGame();
        }
        updateGame(payload);
    });

    socket.on("gameOver", (winnerStr) => {
        let winnerId;
        if (winnerStr !== null) {
            winnerId = parseInt(winnerStr);
        } else {
            winnerId = null;
        }
        endGame(winnerId);
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

    const hostPlayer = players.find((user) => user.id === hostId);
    const otherPlayer = players.find((user) => user.id !== hostId);

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

function showLobby() {
    document.getElementById("game-front").style.display = "none";
    document.getElementById("home-front").style.display = "block";
}

function makeMove(index) {
    if (!ongoingGame) return;
    socket.emit("gameMakeMove", index);
    // switchTurn();
}

function startGame() {
    ongoingGame = true;
    showBoard();

    const lobby = JSON.parse(localStorage.getItem("lobby"));
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!lobby || !currentUser || lobby.users.length !== 2) return;

    const hostId = lobby.host;
    const players = lobby.users;

    const hostPlayer = players.find((user) => user.id === hostId);
    const otherPlayer = players.find((user) => user.id !== hostId);

    if (!hostPlayer || !otherPlayer) return;

    const isHost = currentUser.id === hostPlayer.id;

    if (isHost) {
        document.querySelector(".player-x").textContent = `You (X)`;
        document.querySelector(".player-o").textContent = `${otherPlayer.username} (O)`;
    } else {
        document.querySelector(".player-x").textContent = `${hostPlayer.username} (X)`;
        document.querySelector(".player-o").textContent = `You (O)`;
    }

    document.getElementById("player-1").textContent = `${hostPlayer.username} (X)`;
    document.getElementById("player-2").textContent = `${otherPlayer.username} (O)`;
    xPlayer = hostPlayer.id;
    yPlayer = otherPlayer.id;
}

function endGame(winnerID) {
    const players = getPlayerInfo();

    const winnerUsername =
        players.find((user) => user.id === winnerID)?.username || "nobody";
    alert(`${winnerUsername} won the game`);
    ongoingGame = false;
    showLobby();
}

function updateGame(payload) {
    socket.emit("setGameId", payload.gameId);
    console.log(payload);
    drawBoard(payload.board);
    currentTurnId = parseInt(payload.currentTurn);
    updateTurnHighlight();
}

function updateTurnHighlight() {
    const gameContainer = document.getElementById("game-container");
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user.id, currentTurnId);

    if (currentTurnId === user.id) {
        const color = getPlayerColor(currentTurnId === xPlayer ? "X" : "O");
        console.log(color);
        gameContainer.style.boxShadow = `0px 0px 30px 10px ${color}`;
    } else {
        gameContainer.style.boxShadow = "none";
    }
}

function getPlayerColor(player) {
    console.log("get player color", player);
    return player === "X" ? "rgba(0, 123, 255, 0.6)" : "rgba(255, 99, 71, 0.6)";
}

function getPlayerInfo() {
    return JSON.parse(localStorage.getItem("lobby")).users;
}
