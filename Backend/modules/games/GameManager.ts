import { TicTacToeGame } from "./TicTacToe/TicTacToeGame.js";
import { Game, IGameState } from "./Game.js";
import { PONGGame } from "./PONG/PONGGame.js";

export enum GamesEnum {
    TIC_TAC_TOE,
    PONG
}

type GameConstructor = new (gameId: string, players: string[]) => Game<any>;


export class GameManager {
  private games: Map<string, Game<any>> = new Map();
  static readonly GAME_REGISTRY: Record<GamesEnum, GameConstructor> = {
      [GamesEnum.TIC_TAC_TOE]: TicTacToeGame,
      [GamesEnum.PONG]: PONGGame
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