export enum TicTacToeEvent {
    START_GAME = 'start game',
    MAKE_MOVE = 'make move',
    UPDATE_BOARD = 'update board',
    GAME_OVER = 'game over',
    ERROR = 'error'
}

// Sent from server to frontend
export interface StartGamePayload {
    event: TicTacToeEvent.START_GAME;
    gameId: string;
    lobbyId: number;
    playerX: number;  // references UserID
    playerO: number;  // references UserID
    board: string[]; // array of strings for game state
    turn: number;  // which user goes first
}

// sent from frontend to  server
export interface MakeMovePayload {
    event: TicTacToeEvent.MAKE_MOVE;
    gameId: string;
    playerId: number;
    position: number;
}

// sent from server to frontend after it receives a move fromn the player whose turn it is
export interface UpdateBoardPayload {
    event: TicTacToeEvent.UPDATE_BOARD;
    gameId: string;
    playerId: number;
    position: number;
    board: string[];
    turn: number;
}

// sent after a move is made and the server detects a tie or a win
export interface GameOverPayload {
    event: TicTacToeEvent.GAME_OVER;
    gameId: string;
    winner: number | null;
    winningCombination: number[] | null;
    board: string[];
}

export interface ErrorPayload {
    event: TicTacToeEvent.ERROR;
    message: string;
}

export type TicTacToePayload =
  | StartGamePayload
  | MakeMovePayload
  | UpdateBoardPayload
  | GameOverPayload
  | ErrorPayload;
  