import { randomBytes } from "crypto";
import redis from "../config/RedisStartup.js";

export abstract class LobbyDatabase {
    constructor() {
        this.connect();
    }

    abstract connect(): void;
    abstract createLobby(hostID: number): Promise<string>;
    abstract joinLobby(lobbyId: string, userId: number): Promise<void>;
    abstract leaveLobby(lobbyId: string, userId: number): Promise<void>;
    abstract getLobby(lobbyId: string): Promise<any>;
    abstract getLobbyMembers(lobbyId: string): Promise<number[]>;
}

export class RedisDatabase extends LobbyDatabase {
    connect(): void {
        redis.connect();
    }

    createLobby(host: number): Promise<string> {
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

    async createLobby(host: number): Promise<string> {
        let lobbyId = randomBytes(8).toString("hex");

        while (this.lobbies.has(lobbyId)) {
            lobbyId = randomBytes(8).toString("hex");
        }

        this.lobbies.set(lobbyId, { id: lobbyId, users: [host], host });

        return lobbyId;
    }

    async joinLobby(lobbyId: string, userId: number): Promise<void> {
        if (!this.lobbies.has(lobbyId)) {
            throw new Error("Lobby does not exist");
        }

        const lobby = this.lobbies.get(lobbyId);

        // Check if the user is already in the lobby
        if (lobby && !lobby.users.includes(userId)) {
            lobby.users.push(userId); // Add the user to the lobby
            this.lobbies.set(lobbyId, lobby); // Update the lobby in the map
        }
    }

    async leaveLobby(lobbyId: string, userId: number): Promise<void> {
        if (!this.lobbies.has(lobbyId)) {
            throw new Error("Lobby does not exist");
        }
    
        const lobby = this.lobbies.get(lobbyId);
    
        if (lobby) {
            // Remove the user from the lobby
            lobby.users = lobby.users.filter((user) => user !== userId);
    
            // If the lobby is empty, delete it
            if (lobby.users.length === 0) {
                this.lobbies.delete(lobbyId);  // This will delete the lobby from memory
            } else {
                // Update the lobby in the map
                this.lobbies.set(lobbyId, lobby);
            }
        }
    }

    async getLobby(lobbyId: string) {
        return this.lobbies.get(lobbyId);
    }

    async getLobbyMembers(lobbyId: string): Promise<number[]> {
        return this.lobbies.get(lobbyId)?.users || [];
    }
}
