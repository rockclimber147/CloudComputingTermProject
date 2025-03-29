import socket from "./socket.js";

class PONGGameUI {
    constructor() {
        this.container = document.createElement("div");
        this.container.id = "pong-game-container";
        // Add Bootstrap class to center content
        this.container.classList.add(
            "d-flex",
            "flex-column",
            "align-items-center",
            "justify-content-center",
            "vh-100"
        );

        this.header = document.createElement("h1");
        this.header.textContent = "PONG";
        this.header.classList.add("mb-4"); // Add margin-bottom for spacing

        this.topPlayer = this.header = document.createElement("h1");

        this.canvas = document.createElement("canvas");
        this.canvas.id = "pong-canvas";
        // Add Bootstrap classes for width and height
        this.canvas.classList.add("border");

        // Function to resize the canvas based on the minimum of the width or height of the screen
        const setCanvasSize = () => {
            const minSize = Math.min(window.innerWidth, window.innerHeight) * 0.9;
            this.canvas.width = minSize; // Set width based on the minimum of screen width or height
            this.canvas.height = minSize; // Set height to the same value for a square canvas
        };

        // Set canvas size initially
        setCanvasSize();

        this.bottomPlayer = this.header = document.createElement("h1");

        // Recalculate the size when the window is resized
        window.addEventListener("resize", setCanvasSize);

        // Append elements
        this.container.appendChild(this.header);
        this.container.appendChild(this.topPlayer);
        this.container.appendChild(this.canvas);
        this.container.appendChild(this.bottomPlayer);

        this.ctx = null;
    }

    setEventHandlers(gameHandler) {
        window.addEventListener("keydown", gameHandler.handleKeydown);
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
        window.removeEventListener("keydown", this.keydownHandler);
        if (this.container) {
            this.container.remove();
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
    }

    updateGameState(state) {
        this.gameState = state;
    }

    draw(ui) {
        if (!this.gameState) return;

        const colors = ["Red", "Blue"];

        const { ballPosition, playerStateMap } = this.gameState;
        const players = Object.values(playerStateMap);
        ui.ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height);

        const scaleX = ui.canvas.width / this.GAME_WIDTH;
        const scaleY = ui.canvas.height / this.GAME_HEIGHT;

        ui.ctx.font = `${Math.floor(20 * scaleY)}px Arial`;
        ui.ctx.textAlign = "center";

        // Display scores in the middle of the canvas
        const centerX = ui.canvas.width / 2;
        const scoreY1 = ui.canvas.height / 4; // Score position for player 1
        const scoreY2 = (3 * ui.canvas.height) / 4; // Score position for player 2

        players.forEach((player, index) => {
            let paddleY =
                index === 0 ? 5 : ui.canvas.height - this.PADDLE_HEIGHT * scaleY - 5;
            ui.ctx.fillStyle = colors[index]; // Paddle color
            ui.ctx.fillRect(
                (player.paddlePosition.x - this.PADDLE_WIDTH / 2) * scaleX,
                paddleY,
                this.PADDLE_WIDTH * scaleX,
                this.PADDLE_HEIGHT * scaleY
            );

            // Draw scores with swapped colors
            ui.ctx.fillStyle = colors[1 - index]; // Swapped score colors
            const scoreY = index === 0 ? scoreY2 : scoreY1; // Switched score positions
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

export class PONGHandler {
    constructor(canvasID) {
        this.pongGame = new PONG(canvasID);
        this.ongoingGame = false;
        this.ui = new PONGGameUI();
        this.initializeSocketInteractions();

        this.handleKeydown = (event) => {
            if (event.key === "a" || event.key === "A") {
                this.makeMove(-1);
            } else if (event.key === "d" || event.key === "D") {
                this.makeMove(1);
            }
        };
    }

    initializeSocketInteractions() {
        socket.on("updateGame", (payload) => {
            if (this.ongoingGame == false) {
                this.startGame();
            }
            if (!this.gameIdSet) {
                console.log("setting game id");
                socket.emit("setGameId", payload.gameId);
                this.gameIdSet = true;
            }

            this.pongGame.updateGameState(payload);
            this.pongGame.draw(this.ui);
        });

        socket.on("gameOver", (winner) => {
            this.endGame(winner);
        });
    }

    startGame() {
        document.getElementById("game-front").style.display = "block";
        document.getElementById("home-front").style.display = "none";
        this.ui.setEventHandlers(this);
        this.ui.inject("game-front");
        this.assignPlayers();
        this.ongoingGame = true;
    }

    makeMove(index) {
        if (!this.ongoingGame) return;
        socket.emit("gameMakeMove", index);
    }

    endGame(winnerID) {
        const players = this.getPlayerInfo();
        const winnerUsername =
            players.find((user) => Number(user.id) === Number(winnerID))?.username ||
            "nobody";
        alert(`${winnerUsername} won the game`);
        this.ongoingGame = false;
        socket.emit("unsetGameId");
        document.getElementById("game-front").style.display = "none";
        document.getElementById("home-front").style.display = "block";
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
        this.xPlayer = hostPlayer.id;
        const otherPlayer = players.find((user) => user.id !== hostId);
        this.yPlayer = otherPlayer.id;

        const isHost = currentUser.id === this.xPlayer;
        this.ui.topPlayer.textContent = `${otherPlayer.username}`; // Switched
        this.ui.bottomPlayer.textContent = `${hostPlayer.username}`; // Switched
    }

    getPlayerInfo() {
        return JSON.parse(localStorage.getItem("lobby")).users;
    }

    destroy() {
        // Remove socket event listeners
        socket.off("updateGame");
        socket.off("gameOver");

        // Remove window keydown event listener
        this.ui.destroy();

        this.pongGame = null;
        this.ongoingGame = false;
        this.gameIdSet = false;
    }
}
