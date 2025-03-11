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
    abstract printLobbies(): void;
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

    printLobbies(): void {
        throw new Error("Method not implemented.");
    }
}

export class LocalLobbyDatabase extends LobbyDatabase {
    private static lobbies: Map<string, { id: string; users: number[]; host: number }>;

    constructor() {
        super();
        LocalLobbyDatabase.lobbies = this.getLobbies();
    }

    connect(): void {
        // nothing to do here
    }

    async createLobby(host: number): Promise<string> {
        console.log("Creating lobby", host);
        let lobbyId = randomBytes(8).toString("hex");

        while (LocalLobbyDatabase.lobbies.has(lobbyId)) {
            lobbyId = randomBytes(8).toString("hex");
        }

        LocalLobbyDatabase.lobbies.set(lobbyId, { id: lobbyId, users: [host], host });

        return lobbyId;
    }

    async joinLobby(lobbyId: string, userId: number): Promise<void> {
        console.log("Joining lobby", lobbyId, userId);

        if (!LocalLobbyDatabase.lobbies.has(lobbyId)) {
            throw new Error("Lobby does not exist");
        }

        LocalLobbyDatabase.lobbies.get(lobbyId)?.users.push(userId);
    }

    async leaveLobby(lobbyId: string, userId: number): Promise<void> {
        console.log("Leaving lobby", lobbyId, userId);

        if (!LocalLobbyDatabase.lobbies.has(lobbyId)) {
            throw new Error("Lobby does not exist");
        }

        const lobby = LocalLobbyDatabase.lobbies.get(lobbyId);
        if (!lobby) {
            throw new Error("Lobby does not exist");
        }

        if (!lobby.users.includes(userId)) {
            throw new Error("User not in lobby");
        }

        lobby.users = lobby.users.filter((id) => id !== userId);

        if (lobby.users.length === 0) {
            LocalLobbyDatabase.lobbies.delete(lobbyId);
        }

        if (lobby.host === userId) {
            const randomIndex = Math.floor(Math.random() * lobby.users.length);
            lobby.host = lobby.users[randomIndex];
        }
    }

    async getLobby(lobbyId: string) {
        return LocalLobbyDatabase.lobbies.get(lobbyId);
    }

    async getLobbyMembers(lobbyId: string): Promise<number[]> {
        return LocalLobbyDatabase.lobbies.get(lobbyId)?.users || [];
    }

    printLobbies(): void {
        console.log(LocalLobbyDatabase.lobbies);
    }

    private getLobbies(): Map<string, { id: string; users: number[]; host: number }> {
        if (!LocalLobbyDatabase.lobbies) {
            LocalLobbyDatabase.lobbies = new Map();
        }

        return LocalLobbyDatabase.lobbies;
    }
}
