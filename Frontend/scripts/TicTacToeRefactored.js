import socket from "./socket.js";

class TicTacToeGame {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = "X";
        this.ongoingGame = false;
    }

    makeMove(index) {
        if (!this.ongoingGame || this.board[index] !== null) return;
        this.board[index] = this.currentPlayer;
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        return this.board;
    }

    resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = "X";
        this.ongoingGame = false;
    }
}

export class TicTacToeHandler {
    constructor() {
        this.game = new TicTacToeGame();
        this.currentTurnId = null;
        this.xPlayer = null;
        this.oPlayer = null;
        this.cellClickHandler = this.handleCellClick.bind(this); 
        this.setupSocketEvents()
        this.gameIdSet = false
    }

    setupUI() {
        const cells = document.querySelectorAll(".game-cell");
        cells.forEach((cell) => {
            cell.addEventListener("click", this.cellClickHandler);
        });
    }

    handleCellClick(event) {
        const index = event.target.dataset.index;
        if (!this.game.ongoingGame) return;
        socket.emit("gameMakeMove", index);
    }

    setupSocketEvents() {
        socket.on("updateGame", (payload) => {
            console.log("IN updateGAme from Tetris Handler")
            if (!this.game.ongoingGame) {
                this.startGame();
            }
            this.updateGame(payload);
        });

        socket.on("gameOver", (winnerStr) => {
            this.endGame(winnerStr ? parseInt(winnerStr) : null);
        });
    }

    startGame() {
        this.setupUI()
        this.game.ongoingGame = true;
        document.getElementById("game-front").style.display = "block";
        document.getElementById("home-front").style.display = "none";
        document.getElementById("PONG-front").style.display = "none";
        this.assignPlayers();
    }

    assignPlayers() {
        const lobby = JSON.parse(localStorage.getItem("lobby"));
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!lobby || !currentUser || lobby.users.length !== 2) return;
        console.log("lobby in assignPlayers")
        console.log(lobby)
        const hostId = lobby.host;
        const players = lobby.users;

        const hostPlayer = players.find((user) => user.id === hostId);
        this.xPlayer = hostPlayer.id
        const otherPlayer = players.find((user) => user.id !== hostId);
        this.yPlayer = otherPlayer.id

        const isHost = currentUser.id === this.xPlayer;
        document.querySelector(".player-x").textContent = isHost ? `You (X)` : `${hostPlayer.username} (X)`;
        document.querySelector(".player-o").textContent = isHost ? `${otherPlayer.username} (O)` : `You (O)`;
    }

    endGame(winnerID) {
        const players = JSON.parse(localStorage.getItem("lobby")).users;
        const winnerUsername = players.find((user) => user.id === winnerID)?.username || "Nobody";
        alert(`${winnerUsername} won the game!`);
        this.game.ongoingGame = false;
        socket.emit("unsetGameId");
        document.getElementById("game-front").style.display = "none";
        document.getElementById("home-front").style.display = "block";
        document.getElementById("PONG-front").style.display = "none";
        this.tearDown()
    }

    tearDown() {
        console.log("Tearing down TicTacToeHandler...");

        // Remove event listeners from each cell
        const cells = document.querySelectorAll(".game-cell");
        cells.forEach((cell) => {
            cell.removeEventListener("click", this.cellClickHandler); // Properly remove listener
        });

        // Completely remove and reset the game grid
        const gameGrid = document.getElementById("game-grid");
        gameGrid.innerHTML = ""; // Clears the grid

        // Recreate the empty game cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div");
            cell.classList.add("game-cell");
            cell.dataset.index = i;
            gameGrid.appendChild(cell);
        }
    
        // socket.off("updateGame");
        // socket.off("gameOver");
    }

    destroy() {
        console.log("Destroying TicTacToeHandler...");

        // Remove event listeners from game cells
        this.tearDown()
        // Remove WebSocket listeners
        socket.off("updateGame", this.updateGame);
        socket.off("gameOver", this.endGame);

        // Reset UI (optional)
    }

    updateGame(payload) {
        if (!this.gameIdSet) {
            console.log("setting game id")
            socket.emit("setGameId", payload.gameId);
        }
        this.drawBoard(payload.board);
        this.currentTurnId = parseInt(payload.currentTurn);
        this.updateTurnHighlight();
    }

    drawBoard(board) {
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

    updateTurnHighlight() {
        const gameContainer = document.getElementById("game-container");
        const user = JSON.parse(localStorage.getItem("user"));
        gameContainer.style.boxShadow = this.currentTurnId === user.id ? `0px 0px 30px 10px ${this.getPlayerColor()}` : "none";
    }

    getPlayerColor() {
        return this.currentTurnId === this.xPlayer ? "rgba(0, 123, 255, 0.6)" : "rgba(255, 99, 71, 0.6)";
    }
}
