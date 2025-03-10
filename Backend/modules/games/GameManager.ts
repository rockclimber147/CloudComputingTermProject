import { TicTacToeGame } from "./TicTacToe/TicTacToeGame.js";

export enum GamesEnum {
    TIC_TAC_TOE = 'tic tac toe'
}

type GameConstructor = new (gameId: string, players: string[]) => Game<any>;

export interface IGameState {
    gameId: string;
    players: string[];
    isGameOver(): boolean;
    getWinner(): string | null;
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
}


export class GameManager {
  private games: Map<string, Game<any>> = new Map();
  static readonly GAME_REGISTRY: Record<GamesEnum, GameConstructor> = {
      [GamesEnum.TIC_TAC_TOE]: TicTacToeGame,
  };

  createGame(gameType: GamesEnum, gameId: string, players: string[]) {
      let game: Game<any>;

      const GameClass = GameManager.GAME_REGISTRY[gameType];

      if (!GameClass) {
      throw new Error(`Unknown game type: ${gameType}`);
      }

      game = new GameClass(gameId, players);
      
      this.games.set(gameId, game);
        return game;
  }

  handleMove(gameId: string, playerId: string, move: any): boolean {
    const game = this.games.get(gameId);
    if (!game) throw new Error("Game not found");

    if (game.validateMove(playerId, move)) {
      game.applyMove(playerId, move);
      return true;
    }
    return false;
  }

  getGameState(gameId: string): IGameState | null {
    return this.games.get(gameId) || null;
  }
}