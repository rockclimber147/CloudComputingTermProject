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
        
        const { ballPosition, playerStateMap } = this.gameState;
        const players = Array.from(playerStateMap.values());

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let scaleX = this.canvas.width / this.GAME_WIDTH;
        let scaleY = this.canvas.height / this.GAME_HEIGHT;

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
        pongGame = new PONG(canvasID)
        ongoingGame = false;
        this.initializeSocketInteractions
    }

    initializeSocketInteractions() {
        socket.on("updateGame", (payload) => {
            if (this.ongoingGame == false) {
                this.startGame();
            }
            this.pongGame.updateGameState(payload);
        });


    }
    
    startGame() {
        this.ongoingGame = true
    }
}
