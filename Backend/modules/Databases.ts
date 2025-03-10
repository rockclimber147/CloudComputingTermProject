import redis from "../config/RedisStartup.js";

export abstract class LobbyDatabase {
    constructor() {
        this.connect();
    }

    abstract connect(): void;
    abstract createLobby(lobbyId: string, hostID: number): Promise<void>;
    abstract joinLobby(lobbyId: string, userId: number): Promise<void>;
    abstract leaveLobby(lobbyId: string, userId: number): Promise<void>;
    abstract getLobby(lobbyId: string): Promise<any>;
    abstract getLobbyMembers(lobbyId: string): Promise<number[]>;
}

export class RedisDatabase extends LobbyDatabase {
    connect(): void {
        redis.connect();
    }

    createLobby(lobbyId: string, host: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    joinLobby(lobbyId: string, userId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    leaveLobby(lobbyId: string, userId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getLobby(lobbyId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    getLobbyMembers(lobbyId: string): Promise<number[]> {
        throw new Error("Method not implemented.");
    }
}

export class LocalLobbyDatabase extends LobbyDatabase {
    private lobbies: Map<string, { id: string; users: number[]; host: number }>;

    constructor() {
        super();
        this.lobbies = new Map();
    }

    connect(): void {
        // nothing to do here
    }

    async createLobby(lobbyId: string, host: number): Promise<void> {
        if (this.lobbies.has(lobbyId)) {
            throw new Error("Lobby already exists");
        }

        this.lobbies.set(lobbyId, { id: lobbyId, users: [host], host });
    }

    async joinLobby(lobbyId: string, userId: number): Promise<void> {
        if (!this.lobbies.has(lobbyId)) {
            throw new Error("Lobby does not exist");
        }

        this.lobbies.get(lobbyId)?.users.push(userId);
    }

    async leaveLobby(lobbyId: string, userId: number): Promise<void> {
        if (!this.lobbies.has(lobbyId)) {
            throw new Error("Lobby does not exist");
        }

        this.lobbies
            .get(lobbyId)
            ?.users.splice(this.lobbies.get(lobbyId)?.users.indexOf(userId) || 0, 1);
    }

    async getLobby(lobbyId: string) {
        return this.lobbies.get(lobbyId);
    }

    async getLobbyMembers(lobbyId: string): Promise<number[]> {
        return this.lobbies.get(lobbyId)?.users || [];
    }
}
