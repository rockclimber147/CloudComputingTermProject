import { Game } from "../Game.js";

class Vector {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    getMagnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    scaleBy(factor: number) {
        this.x *= factor;
        this.y *= factor;
    }

    scaleTo(factor: number) {
        let length = this.getMagnitude()
        this.scaleBy(factor / length)
    }
}

class PlayerState {
    score: number = 0;
    paddlePosition: Vector;

    constructor(paddleYPosition: number) {
        this.paddlePosition = new Vector(50, paddleYPosition);
    }
}

export class PONGGame extends Game<number> {
    static readonly PADDLE_MOVE_SPEED = 1.7;
    static readonly SCORE_TO_WIN = 10;
    static readonly GAME_WIDTH = 100;
    static readonly PADDLE_WIDTH = 17;
    static readonly PADDLE_OFFSET = 5;
    static readonly BALL_MIN_VELOCITY = 1;
    static readonly BALL_MAX_VELOCITY = 3;

    ballPosition: Vector = new Vector();
    ballVelocity: Vector = new Vector();
    playerStateMap: { [key: string]: PlayerState } = {};

    constructor(gameId: string, players: string[]) {
        super(gameId, players);
        for (let i = 0; i < players.length; i++) {
            this.playerStateMap[players[i]] = new PlayerState(PONGGame.GAME_WIDTH * i);
        }
        this.resetBall()
    }

    isGameOver(): boolean {
        for (const player of this.players) {
            let playerScore = this.playerStateMap[player]?.score;
            if (playerScore !== undefined && playerScore >= PONGGame.SCORE_TO_WIN) {
                return true;
            }
        }

        return false;
    }

    getWinner(): string | null {
        for (const player of this.players) {
            let playerScore = this.playerStateMap[player]?.score;
            if (playerScore !== undefined && playerScore >= PONGGame.SCORE_TO_WIN) {
                return player;
            }
        }

        return null;
    }

    validateMove(playerId: string, move: number): boolean {
        return true;
    }

    applyMove(playerId: string, move: number): void {
        move = Math.sign(move);
        if (!this.validateMove(playerId, move)) {
            throw new Error("Invalid move");
        }
        let playerState = this.playerStateMap[playerId];
        if (!playerState) return;
        playerState.paddlePosition.x += move * PONGGame.PADDLE_MOVE_SPEED;
        playerState.paddlePosition.x = Math.max(
            0,
            Math.min(PONGGame.GAME_WIDTH, playerState.paddlePosition.x)
        );
    }

    update() {
        this.ballPosition.add(this.ballVelocity);

        if (this.ballPosition.x <= 0 || this.ballPosition.x >= PONGGame.GAME_WIDTH) {
            this.ballVelocity.x *= -1;
            this.ballPosition.x = Math.max(
                1,
                Math.min(PONGGame.GAME_WIDTH - 1, this.ballPosition.x)
            );
        }

        let ballX = this.ballPosition.x;
        let topPlayer = this.playerStateMap[this.players[0]]!;
        let bottomPlayer = this.playerStateMap[this.players[1]]!;

        if (this.ballPosition.y <= PONGGame.PADDLE_OFFSET) {
            if (
                ballX >= topPlayer.paddlePosition.x - PONGGame.PADDLE_WIDTH / 2 &&
                ballX <= topPlayer.paddlePosition.x + PONGGame.PADDLE_WIDTH / 2
            ) {
                this.reflectBallY();
                this.ballPosition.y = PONGGame.PADDLE_OFFSET + 1;
            } else {
                bottomPlayer.score += 1; // Reverted scoring logic
                this.resetBall();
            }
        }

        if (this.ballPosition.y >= PONGGame.GAME_WIDTH - PONGGame.PADDLE_OFFSET) {
            if (
                ballX >= bottomPlayer.paddlePosition.x - PONGGame.PADDLE_WIDTH / 2 &&
                ballX <= bottomPlayer.paddlePosition.x + PONGGame.PADDLE_WIDTH / 2
            ) {
                this.reflectBallY();
                this.ballPosition.y = PONGGame.GAME_WIDTH - PONGGame.PADDLE_OFFSET - 1;
            } else {
                topPlayer.score += 1; // Reverted scoring logic
                this.resetBall();
            }
        }
    }

    reflectBallY() {
        this.ballVelocity.y *= -1;
        this.ballVelocity.scaleBy(1.1)
        if (this.ballVelocity.getMagnitude() > PONGGame.BALL_MAX_VELOCITY) {
            this.ballVelocity.scaleTo(PONGGame.BALL_MAX_VELOCITY)
        }
    }

    resetBall() {
        this.ballPosition = new Vector(
            PONGGame.GAME_WIDTH / 2,
            PONGGame.GAME_WIDTH / 2
        );
    
        const ballX = this.getRandomBallVelocity();
        const ballY = Math.sign(this.getRandomBallVelocity()) * Math.abs(ballX) * 1.5;
    
        this.ballVelocity = new Vector(ballX, ballY);
        this.ballVelocity.scaleTo(PONGGame.BALL_MIN_VELOCITY);
    }

    getRandomPositiveBallVelocity(): number {
        return (
            Math.random() * (PONGGame.BALL_MAX_VELOCITY - PONGGame.BALL_MIN_VELOCITY) +
            PONGGame.BALL_MIN_VELOCITY
        );
    }

    getRandomBallVelocity(): number {
        return Math.random() < 0.5
            ? this.getRandomPositiveBallVelocity()
            : -1 * this.getRandomPositiveBallVelocity();
    }
}
