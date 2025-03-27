export interface IGameState {
    gameId: string;
    players: string[];
    isGameOver(): boolean;
    getWinner(): string | null;
    update(): void
}

export abstract class Game<TMove> implements IGameState {
  gameId: string;
  players: string[];
  protected state: any;

  constructor(gameId: string, players: string[]) {
    this.gameId = gameId;
    this.players = players;
  }
  
  abstract isGameOver(): boolean;
  abstract getWinner(): string | null;
  abstract validateMove(playerId: string, move: TMove): boolean;
  abstract applyMove(playerId: string, move: TMove): void;
  abstract update(): void
}