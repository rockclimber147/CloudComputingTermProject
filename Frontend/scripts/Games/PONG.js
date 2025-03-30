import socket from "../socket.js";
import { SocketEmitEnums, SocketListenEnums } from "../socket.js";
import { GameHandler, HomeElementEnums } from "./Game.js";


class PONGGameUI {
    constructor() {
        this.container = null;
        this.header = null;
        this.topPlayer = null;
        this.canvas = null;
        this.bottomPlayer = null;
        this.ctx = null;
    }

    initialize() {
        this.container = document.createElement("div");
        this.container.id = "pong-game-container";
        this.container.classList.add(
            "d-flex",
            "flex-column",
            "align-items-center",
            "justify-content-center",
            "vh-100"
        );

        this.header = document.createElement("h1");
        this.header.textContent = "PONG";
        this.header.classList.add("mb-4");

        this.topPlayer = document.createElement("h1"); // Fix assignment mistake
        this.bottomPlayer = document.createElement("h1");

        this.canvas = document.createElement("canvas");
        this.canvas.id = "pong-canvas";
        this.canvas.classList.add("border");

        // Function to resize the canvas
        const setCanvasSize = () => {
            if (!this.canvas) return;
            const minSize = Math.min(window.innerWidth, window.innerHeight) * 0.9;
            this.canvas.width = minSize;
            this.canvas.height = minSize;
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        this.container.appendChild(this.header);
        this.container.appendChild(this.topPlayer);
        this.container.appendChild(this.canvas);
        this.container.appendChild(this.bottomPlayer);

        this.ctx = this.canvas.getContext("2d");
    }

    inject(targetSelector) {
        const target = document.getElementById(targetSelector);
        if (target) {
            console.log("Injecting ui into");
            console.log(target);
            target.appendChild(this.container);
            this.ctx = this.canvas.getContext("2d");
        } else {
            console.error(
                `Inject failed: No element found with selector '${targetSelector}'`
            );
        }
    }

    destroy() {
        window.removeEventListener("resize", this.setCanvasSize);
        if (this.container) {
            this.container.remove();
            this.container = null; // Ensures the reference is cleared
            this.canvas = null;
            this.ctx = null;
        }
    }
}

export class PONG {
    constructor() {
        this.GAME_WIDTH = 100;
        this.GAME_HEIGHT = 100;
        this.PADDLE_WIDTH = 15;
        this.PADDLE_HEIGHT = 5;
        this.BALL_SIZE = 3;

        this.gameState = null; // Will hold backend game state
        this.gameIdSet = false;
        this.topPlayer = null;
        this.bottomPlayer = null;
    }

    updateGameState(state) {
        this.gameState = state;
    }

    draw(ui) {
        if (!this.gameState) return;

        const { ballPosition, playerStateMap } = this.gameState;
        playerStateMap[this.topPlayer].color = "red"
        playerStateMap[this.bottomPlayer].color = "blue"
        const players = Object.entries(playerStateMap);
        ui.ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);

        const scaleX = ui.canvas.width / this.GAME_WIDTH;
        const scaleY = ui.canvas.height / this.GAME_HEIGHT;

        ui.ctx.font = `${Math.floor(20 * scaleY)}px Arial`;
        ui.ctx.textAlign = "center";

        // Display scores in the middle of the canvas
        const centerX = ui.canvas.width / 2;
        const scoreY1 = ui.canvas.height / 4; // Score position for player 1
        const scoreY2 = (3 * ui.canvas.height) / 4; // Score position for player 2

        players.forEach(([key, player]) => {
            let paddleY =
                key == this.topPlayer ? 5 : ui.canvas.height - this.PADDLE_HEIGHT * scaleY - 5;
            ui.ctx.fillStyle = player.color; // Paddle color
            ui.ctx.fillRect(
                (player.paddlePosition.x - this.PADDLE_WIDTH / 2) * scaleX,
                paddleY,
                this.PADDLE_WIDTH * scaleX,
                this.PADDLE_HEIGHT * scaleY
            );

            // Draw scores with original colors and positions
            ui.ctx.fillStyle = player.color; // Reverted score colors
            const scoreY = key == this.topPlayer ? scoreY1 : scoreY2; // Reverted score positions
            ui.ctx.fillText(player.score, centerX, scoreY);
        });

        // Draw the ball
        ui.ctx.fillStyle = "black";
        ui.ctx.beginPath();
        ui.ctx.arc(
            ballPosition.x * scaleX,
            ballPosition.y * scaleY,
            this.BALL_SIZE * scaleX,
            0,
            Math.PI * 2
        );
        ui.ctx.fill();
    }
}

export class PONGHandler extends GameHandler {
    constructor(canvasID) {
        super();
        this.pongGame = new PONG(canvasID);
        this.ongoingGame = false;
        this.ui = new PONGGameUI();

        this.handleKeydown = (event) => {
            if (event.key === "a" || event.key === "A") {
                this.makeMove(-1);
            } else if (event.key === "d" || event.key === "D") {
                this.makeMove(1);
            }
        };
    }

    setupSocketEvents() {
        console.log("Initializing PONG sockets")
        socket.on(SocketListenEnums.UPDATE_GAME, (payload) => {
            if (this.ongoingGame == false) {
                this.startGame();
            }
            if (!this.gameIdSet) {
                console.log("setting game id");
                socket.emit(SocketEmitEnums.SET_GAME_ID, payload.gameId);
                this.gameIdSet = true;
            }

            this.pongGame.updateGameState(payload);
            this.pongGame.draw(this.ui);
        });

        socket.on(SocketListenEnums.GAME_OVER, (winner) => {
            this.endGame(winner);
        });
    }

    tearDownSocketEvents() {
        socket.off(SocketListenEnums.UPDATE_GAME);
        socket.off(SocketListenEnums.GAME_OVER);
    }

    setupUIEvents() {
        window.addEventListener("keydown", this.handleKeydown);
    }

    startGame() {
        this.ui.initialize();
        this.ui.inject(HomeElementEnums.GAME_DIV);
        this.setupUIEvents();
        this.setupSocketEvents();
        this.assignPlayers();
        this.ongoingGame = true;
        this.showGame()
    }

    makeMove(index) {
        if (!this.ongoingGame) return;
        socket.emit(SocketEmitEnums.GAME_MAKE_MOVE, index);
    }

    endGame(winnerID) {
        this.ongoingGame = false;
        const players = this.getPlayerInfo();
        const winnerUsername =
            players.find((user) => Number(user.id) === Number(winnerID))?.username ||
            "nobody";
        alert(`${winnerUsername} won the game`);
        this.ongoingGame = false;
        socket.emit(SocketEmitEnums.UNSET_GAME_ID);
        console.log("Reverting Frontend")
        this.destroy()
        this.hideGame()
    }

    assignPlayers() {
        const lobby = JSON.parse(localStorage.getItem("lobby"));
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!lobby || !currentUser || lobby.users.length !== 2) return;
        console.log("lobby in assignPlayers");
        console.log(lobby);
        const hostId = lobby.host;
        const players = lobby.users;

        const hostPlayer = players.find((user) => user.id === hostId);
        this.pongGame.topPlayer = hostPlayer.id;
        const otherPlayer = players.find((user) => user.id !== hostId);
        this.pongGame.bottomPlayer = otherPlayer.id;

        this.ui.topPlayer.textContent = `${hostPlayer.username}`;
        this.ui.bottomPlayer.textContent = `${otherPlayer.username}`;
    }

    getPlayerInfo() {
        return JSON.parse(localStorage.getItem("lobby")).users;
    }

    destroy() {
        console.log("Destroying PONG game")
        this.tearDownSocketEvents()
        this.ui.destroy();

        this.pongGame = null;
        this.ongoingGame = false;
        this.gameIdSet = false;
    }
}
