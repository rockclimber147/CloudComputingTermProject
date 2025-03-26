import socket from "./socket.js";

export class PONG {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.GAME_WIDTH = 100;
        this.GAME_HEIGHT = 100;
        this.PADDLE_WIDTH = 15;
        this.PADDLE_HEIGHT = 5;
        this.BALL_SIZE = 3;
        
        this.gameState = null; // Will hold backend game state
    }

    updateGameState(state) {
        this.gameState = state;
        this.draw();
    }

    draw() {
        if (!this.gameState) return;
        console.log(this.gameState);
        
        const { ballPosition, playerStateMap } = this.gameState;
        const players = Object.values(playerStateMap);
    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        const scaleX = this.canvas.width / this.GAME_WIDTH;
        const scaleY = this.canvas.height / this.GAME_HEIGHT;
    
        players.forEach((player, index) => {
            let paddleY = index === 0 ? 5 : this.canvas.height - this.PADDLE_HEIGHT - 5;
            this.ctx.fillRect(player.paddlePosition.x * scaleX, paddleY, this.PADDLE_WIDTH * scaleX, this.PADDLE_HEIGHT);
        });
        this.ctx.beginPath();
        this.ctx.arc(ballPosition.x * scaleX, ballPosition.y * scaleY, this.BALL_SIZE, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

export class PONGHandler {
    constructor(canvasID) {
        this.pongGame = new PONG(canvasID)
        this.ongoingGame = false;
        this.initializeSocketInteractions()
        this.gameLoop = null
    }

    initializeSocketInteractions() {
        socket.on("updateGame", (payload) => {
            if (this.ongoingGame == false) {
                this.startGame();
            }
            this.pongGame.updateGameState(payload);
        });

        window.addEventListener("keydown", (event) => {
            if (event.key === "a" || event.key === "A") {
                this.makeMove(-1)
            } else if (event.key === "d" || event.key === "D") {
                this.makeMove(1)
            }
        });
    }
    
    startGame() {
        document.getElementById("game-front").style.display = "none";
        document.getElementById("home-front").style.display = "none";
        document.getElementById("PONG-front").style.display = "block";
        this.ongoingGame = true
    }

    makeMove(index) {
        if (!this.ongoingGame) return;
        socket.emit("gameMakeMove", index);
    }

    endGame(winnerID) {
        const players = getPlayerInfo();
    
        const winnerUsername =
            players.find((user) => user.id === winnerID)?.username || "nobody";
        alert(`${winnerUsername} won the game`);
        ongoingGame = false;
        socket.emit("unsetGameId");
        clearInterval(this.gameLoop);
        document.getElementById("game-front").style.display = "none";
        document.getElementById("home-front").style.display = "block";
        document.getElementById("PONG-front").style.display = "none";
    }
}