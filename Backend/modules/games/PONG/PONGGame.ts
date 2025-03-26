import { Game } from "../Game.js";

class Vector {
    x: number;
    y: number;
    constructor(x: number=0, y:number=0){
        this.x = x;
        this.y = y;
    }

    add(vector: Vector) {
        this.x += vector.x
        this.y += vector.y
    }
}

class PlayerState {
    score: number = 0
    paddlePosition: Vector

    constructor(paddleYPosition: number) {
        this.paddlePosition = new Vector(50, paddleYPosition)
    }
}

export class PONGGame extends Game<number> {
    static readonly PADDLE_MOVE_SPEED = 3
    static readonly SCORE_TO_WIN = 5
    static readonly GAME_WIDTH = 100
    static readonly PADDLE_WIDTH = 15
    static readonly PADDLE_OFFSET = 5;

    ballPosition = new Vector(50, 50)
    ballVelocity = new Vector(5, 5)
    playerStateMap: { [key: string]: PlayerState } = {};

    constructor(gameId: string, players: string[]) {
        super(gameId, players);
        console.log("in PONGGame constructor")
        console.log(players)
        for (let i = 0; i < players.length; i++) {
            this.playerStateMap[players[i]] = new PlayerState(PONGGame.GAME_WIDTH * i)
        }
        console.log(this.playerStateMap)
    }

    isGameOver(): boolean {
        this.players.forEach(player => {
            let playerScore = this.playerStateMap[player]?.score
            if (!!playerScore && playerScore >= PONGGame.SCORE_TO_WIN) return true
        })
        return false;
    }
    
    getWinner(): string | null {
        this.players.forEach(player => {
            let playerScore = this.playerStateMap[player]?.score
            if (!!playerScore && playerScore >= PONGGame.SCORE_TO_WIN) return player
        })
        return null;
    }
    
    validateMove(playerId: string, move: number): boolean {
        return true;
    }
    

    applyMove(playerId: string, move: number): void {
        move = Math.sign(move)
        if (!this.validateMove(playerId, move)) {
            throw new Error("Invalid move");
        }
        let playerState = this.playerStateMap[playerId]
        if (!playerState) return
        playerState.paddlePosition.x += move * PONGGame.PADDLE_MOVE_SPEED
        playerState.paddlePosition.x = Math.max(0, Math.min(PONGGame.GAME_WIDTH, playerState.paddlePosition.x))
    }

    update() {
        this.ballPosition.add(this.ballVelocity);
    
        if (this.ballPosition.x <= 0 || this.ballPosition.x >= PONGGame.GAME_WIDTH) {
            this.ballVelocity.x *= -1;
            this.ballPosition.x = Math.max(1, Math.min(PONGGame.GAME_WIDTH - 1, this.ballPosition.x));
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
                bottomPlayer.score += 1;
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
                topPlayer.score += 1;
                this.resetBall();
            }
        }
    }

    reflectBallY() {
        this.ballVelocity.y *= -1
    }
    
    resetBall() {
        this.ballPosition = new Vector(50, 50);
        
        // Ensure the ball has a decent speed
        let speed = 2 + Math.random() * 2;  
        let angle = (Math.random() * Math.PI) / 2 - Math.PI / 4; // Random angle between -45 and 45 degrees
        this.ballVelocity = new Vector(
            speed * Math.sign(Math.random() - 0.5),
            speed * Math.sin(angle)
        );
    }
}