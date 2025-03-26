import { Socket } from "socket.io";
import { LobbyDatabase, LocalLobbyDatabase } from "../modules/Databases.js";
import { io } from "../config/SocketServer.js";
import { GameManager, GamesEnum } from "../modules/games/GameManager.js";
import { Game } from "../modules/games/Game.js";

const gameManager = new GameManager();

export class SocketSession {
    socket: Socket;
    db: LobbyDatabase;
    userID: number | null;
    lobbyId: string | null;
    gameId: string | null;
    private gameLoopInterval: NodeJS.Timeout | null = null;
    constructor(socket: Socket) {
        this.socket = socket;
        this.db = new LocalLobbyDatabase();
        this.userID = null;
        this.lobbyId = null;
        this.gameId = null;
    }

    setUserID(userID: number) {
        this.userID = userID;
    }

    setGameID(gameID: string) {
        this.gameId = gameID;
    }

    unsetGameID() {
        this.gameId = null;
    }

    hasGameId() {
        return this.gameId != null;
    }

    async createLobby() {
        if (!this.userID) {
            throw new Error("User not authenticated in createLobby");
        }

        const lobbyId = await this.db.createLobby(this.userID);
        await this.socket.join(lobbyId);
        this.lobbyId = lobbyId;
        await this.updateLobbyMembers(this.lobbyId);
    }

    async joinLobby(lobbyId: string) {
        if (!this.userID) {
            throw new Error("User not authenticated in joinLobby");
        }

        if (this.lobbyId) {
            await this.leaveLobby();
        }

        await this.db.joinLobby(lobbyId, this.userID);
        await this.socket.join(lobbyId);
        this.lobbyId = lobbyId;
        await this.updateLobbyMembers(this.lobbyId);
    }

    async leaveLobby() {
        if (!this.userID) {
            throw new Error("User not authenticated in leaveLobby");
        }

        if (!this.lobbyId) {
            throw new Error("User not in a lobby on leaveLobby");
        }
        const prevLobbyId = this.lobbyId;

        await this.db.leaveLobby(this.lobbyId, this.userID);
        await this.socket.leave(this.lobbyId);
        this.lobbyId = null
        await this.updateLobbyMembers(prevLobbyId)
    }

    async emitGameType(game: number) {
        if (!this.lobbyId) {
            throw new Error("no lobby exists");
        }
        io.to(this.lobbyId).emit("setGame", game);
    }

    async createGame(gameType: number) {
        if (!this.userID) {
            throw new Error("User not authenticated in createGame");
        }

        if (!this.lobbyId) {
            throw new Error("User not in a lobby");
        }

        if (this.gameId) {
            throw new Error(`Game already created, ${this.gameId}`);
        }

        const players = await this.db.getLobbyMembers(this.lobbyId);
        const gameEnumString = GamesEnum[gameType];
        const gameEnum = GamesEnum[gameEnumString as keyof typeof GamesEnum];

        this.gameId = gameManager.createGame(
            gameEnum,
            this.lobbyId,
            players.map((p) => p.id.toString())
        ).gameId;
        await this.updateGame();

        if (gameEnum === GamesEnum.PONG) {
            this.startGameLoop();
        }
    }

    private startGameLoop() {
        if (!this.gameId || !this.lobbyId) return;

        console.log("Starting game loop for Pong...");

        // Run every 50ms (~20 updates per second)
        this.gameLoopInterval = setInterval(async () => {
            try {
                const game = gameManager.getGameState(this.gameId!);
                if (!game) {
                    console.error("Game state not found.");
                    this.stopGameLoop();
                    return;
                }
                game.update()
                io.to(this.lobbyId!).emit("updateGame", game);

                if (game.isGameOver()) {
                    console.log("Game over detected, stopping loop.");
                    this.stopGameLoop();
                    await this.gameOver(game.getWinner());
                }
            } catch (error) {
                console.error("Error in game loop:", error);
            }
        }, 50);
    }

    private stopGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
            console.log("Game loop stopped.");
        }
    }

    async makeMove(index: number) {
        if (!this.gameId) {
            throw new Error("can't make a move when no game present");
        }

        if (!this.userID) {
            throw new Error("Can't make a move when no userId");
        }

        const succeed = gameManager.handleMove(
            this.gameId,
            this.userID.toString(),
            index
        );
        if (!succeed) {
            throw new Error("Invalid move");
        }
        this.updateGame();
    }

    async gameOver(winner: string | null) {
        if (!this.lobbyId) {
            throw new Error("user not part of a lobby in gameOver");
        }

        io.to(this.lobbyId).emit("gameOver", winner);
        this.unsetGameID();
        this.stopGameLoop(); 
    }

    private async updateLobbyMembers(lobbyId: string) {
        const lobby = await this.db.getLobby(lobbyId);
        if (!lobby) {
            return;
        }
        const members = await this.db.getLobbyMembers(lobbyId);
        this.db.printLobbies();

        const fullLobby = {
            id: lobby.id,
            users: members,
            host: lobby.host,
        };

        io.to(lobbyId).emit("updateLobby", fullLobby);
    }

    private async updateGame() {
        if (!this.gameId) {
            throw new Error("Game not found");
        }

        if (!this.lobbyId) {
            throw new Error("User not in a lobby");
        }

        const game = gameManager.getGameState(this.gameId);
        if (!game) {
            throw new Error("Game not found");
        }

        io.to(this.lobbyId).emit("updateGame", game);

        if (game.isGameOver()) {
            const winner = game.getWinner();
            await this.gameOver(winner);
            return;
        }
    }
}
