import { Game } from "../Game.js";

export class TicTacToeGame extends Game<number> {
    private board: (string | null)[] = Array(9).fill(null);
    private currentTurn: string;
  
    constructor(gameId: string, players: string[]) {
      super(gameId, players);
      this.currentTurn = players[0];
    }
  
    isGameOver(): boolean {
      return this.getWinner() !== null || this.board.every(cell => cell !== null);
    }
  
    getWinner(): string | null {
      const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      for (const [a, b, c] of winningCombinations) {
        if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
          return this.board[a];
        }
      }
      return null;
    }
  
    validateMove(playerId: string, move: number): boolean {
      return this.players.includes(playerId) &&
             playerId === this.currentTurn &&
             this.board[move] === null;
    }
    
    //TODO: Better information about moves
    applyMove(playerId: string, move: number): void {
      if (!this.validateMove(playerId, move)) {
        throw new Error("Invalid move");
      }
      this.board[move] = playerId;
      this.currentTurn = this.players.find(p => p !== playerId)!;
    }
  }