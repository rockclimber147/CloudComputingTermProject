import socket from "../socket.js";
import { SocketEmitEnums, SocketListenEnums } from "../socket.js";
import { GameHandler, HomeElementEnums } from "./Game.js";

class TicTacToeUI {
    constructor() {
        this.container = null;
        this.gameGrid = null;
        this.gameCells = [];
        this.playerX = null; // Instance variable for Player 1 (X)
        this.playerO = null; // Instance variable for Player 2 (O)
    }

    // Initialize the UI elements
    initialize() {
        // Create container
        this.container = document.createElement("div");
        this.container.id = "tic-tac-toe-ui";

        // Create header
        const header = document.createElement("h2");
        header.textContent = "Tic-Tac-Toe";

        // Create player information
        const playerInfo = document.createElement("p");
        playerInfo.classList.add("lead");
        playerInfo.innerHTML = `<span id="player-1">Player 1 (X)</span> vs <span id="player-2">Player 2 (O)</span>`;

        // Create the game container
        const gameContainer = document.createElement("div");
        gameContainer.classList.add("row");
        gameContainer.innerHTML = `
            <div class="col-md-6 offset-md-3">
                <div id="game-container" class="game-container">
                    <!-- Player divs will be added here dynamically -->
                    <div class="game-grid" id="game-grid">
                        <!-- Cells will be inserted dynamically -->
                    </div>
                </div>
            </div>
        `;

        // Initialize player-x and player-o divs as instance variables
        this.playerX = document.createElement("h1");
        this.playerX.classList.add("player-x");
        this.playerX.textContent = "Player 1 (X)";

        this.playerO = document.createElement("h1");
        this.playerO.classList.add("player-o");
        this.playerO.textContent = "Player 2 (O)";

        // Get the game grid container and append player divs and cells
        const gameContainerElem = gameContainer.querySelector(".game-container");
        gameContainerElem.insertBefore(
            this.playerX,
            gameContainerElem.querySelector(".game-grid")
        );
        gameContainerElem.appendChild(this.playerO);

        // Assign the game grid div
        this.gameGrid = gameContainer.querySelector("#game-grid");

        // Create the game cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div");
            cell.classList.add("game-cell");
            cell.dataset.index = i;
            this.gameCells.push(cell);
            this.gameGrid.appendChild(cell);
        }

        // Append everything to the container
        this.container.appendChild(header);
        this.container.appendChild(playerInfo);
        this.container.appendChild(gameContainer);
    }

    // Inject the UI into the target element in the DOM
    inject(targetSelector) {
        const target = document.getElementById(targetSelector);
        if (target) {
            target.appendChild(this.container);
        } else {
            console.error(
                `Inject failed: No element found with selector '${targetSelector}'`
            );
        }
    }

    // Destroy the UI and remove all elements
    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
            this.gameGrid = null;
            this.gameCells = [];
            this.playerX = null;
            this.playerO = null;
        }
    }
}

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

export class TicTacToeHandler extends GameHandler {
    constructor() {
        super();
        this.game = new TicTacToeGame();
        this.currentTurnId = null;
        this.xPlayer = null;
        this.oPlayer = null;
        this.gameIdSet = false;
        this.ui = new TicTacToeUI();
        this.ongoingGame = false
        console.log(this)
    }

    setupUIEvents() {
        const cells = this.ui.gameCells;
        cells.forEach((cell) => {
            cell.addEventListener("click", this.handleCellClick.bind(this));
        });
    }

    handleCellClick(event) {
        const index = event.target.dataset.index;
        if (!this.game.ongoingGame) return;
        socket.emit(SocketEmitEnums.GAME_MAKE_MOVE, index);
    }

    destroyUIEvents() {
        const cells = this.ui.gameCells;
        cells.forEach((cell) => {
            cell.removeEventListener("click", this.handleCellClick);
        });
    }

    setupSocketEvents() {
        socket.on(SocketListenEnums.UPDATE_GAME, (payload) => {
            if (!this.game.ongoingGame) {
                this.startGame();
            }
            this.updateGame(payload);
        });

        socket.on(SocketListenEnums.GAME_OVER, (winnerStr) => {
            this.endGame(winnerStr ? parseInt(winnerStr) : null);
        });
    }

    tearDownSocketEvents() {
        socket.off(SocketListenEnums.UPDATE_GAME);
        socket.off(SocketListenEnums.GAME_OVER);
    }

    startGame() {
        this.ui.initialize();
        this.ui.inject(HomeElementEnums.GAME_DIV);
        this.setupUIEvents();
        this.setupSocketEvents();
        this.assignPlayers();
        this.game.ongoingGame = true;
        this.showGame()
    }

    assignPlayers() {
        const lobby = JSON.parse(localStorage.getItem("lobby"));
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!lobby || !currentUser || lobby.users.length !== 2) return;
        const hostId = lobby.host;
        const players = lobby.users;

        const hostPlayer = players.find((user) => user.id === hostId);
        this.xPlayer = hostPlayer.id;
        const otherPlayer = players.find((user) => user.id !== hostId);
        this.yPlayer = otherPlayer.id;

        const isHost = currentUser.id === this.xPlayer;
        this.ui.playerX.textContent = isHost ? `You (X)` : `${hostPlayer.username} (X)`;
        this.ui.playerO.textContent = isHost
            ? `${otherPlayer.username} (O)`
            : `You (O)`;
    }

    endGame(winnerID) {
        const players = JSON.parse(localStorage.getItem("lobby")).users;
        const winnerUsername =
            players.find((user) => user.id === winnerID)?.username || "Nobody";
        alert(`${winnerUsername} won the game!`);
        this.game.ongoingGame = false;
        socket.emit(SocketEmitEnums.UNSET_GAME_ID);
        this.hideGame()
        this.destroy();
    }

    destroy() {
        console.log("Destroying TicTacToeHandler...");
        this.destroyUIEvents()
        this.ui.destroy();
        this.tearDownSocketEvents();
    }

    updateGame(payload) {
        if (!this.gameIdSet) {
            console.log("setting game id");
            socket.emit(SocketEmitEnums.SET_GAME_ID, payload.gameId);
        }
        this.drawBoard(payload.board);
        this.currentTurnId = parseInt(payload.currentTurn);
        this.updateTurnHighlight();
    }

    drawBoard(board) {
        const grid = this.ui.gameCells;
        console.log("in draw board");
        console.log(grid);
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
        const gameContainer = this.ui.container.querySelector("#game-container");
        const user = JSON.parse(localStorage.getItem("user"));
        if (gameContainer) {
            gameContainer.style.boxShadow =
                this.currentTurnId === user.id
                    ? `0px 0px 30px 10px ${this.getPlayerColor()}`
                    : "none";
        }
    }

    getPlayerColor() {
        return this.currentTurnId === this.xPlayer
            ? "rgba(0, 123, 255, 0.6)"
            : "rgba(255, 99, 71, 0.6)";
    }
}
