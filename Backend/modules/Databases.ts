import { randomBytes } from "crypto";
import redisService from "../config/RedisStartup.js";
import { userRepository } from "../config/RepositoryInit.js";
import { UserBasicInfo } from "../models/User.js";

export abstract class LobbyDatabase {
    constructor() {
        this.connect();
    }

    abstract connect(): void;
    abstract createLobby(hostID: number): Promise<string>;
    abstract joinLobby(lobbyId: string, userId: number): Promise<void>;
    abstract leaveLobby(lobbyId: string, userId: number): Promise<void>;
    abstract getLobby(lobbyId: string): Promise<any>;
    abstract getLobbyMembers(lobbyId: string): Promise<UserBasicInfo[]>;
    abstract printLobbies(): void;
    abstract isUserOnline(userID: number): Promise<boolean>;
}

export class RedisDatabase extends LobbyDatabase {
    connect(): void {
        redisService.connect();
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

    getLobbyMembers(lobbyId: string): Promise<UserBasicInfo[]> {
        throw new Error("Method not implemented.");
    }

    printLobbies(): void {
        throw new Error("Method not implemented.");
    }

    isUserOnline(userID: number): Promise<boolean> {
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
            throw new Error("Lobby does not exist for join");
        }

        LocalLobbyDatabase.lobbies.get(lobbyId)?.users.push(userId);
    }

    async leaveLobby(lobbyId: string, userId: number): Promise<void> {
        console.log("Leaving lobby", lobbyId, userId);

        const lobby = LocalLobbyDatabase.lobbies.get(lobbyId);
        if (!lobby) {
            console.log(lobbyId);
            throw new Error(`Lobby does not exist for leave ${lobbyId}`);
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

    async getLobbyMembers(lobbyId: string): Promise<UserBasicInfo[]> {
        const lobby = await this.getLobby(lobbyId);
        if (!lobby) {
            throw new Error("Lobby does not exist for getLobbyMembers");
        }

        const userInfo = await Promise.all(
            lobby.users.map((id) => userRepository.getUser(id))
        );

        return userInfo;
    }

    printLobbies(): void {
        console.log(LocalLobbyDatabase.lobbies);
    }

    async isUserOnline(userID: number): Promise<boolean> {
        console.log("isUserOnline", this.getLobbies());
        for (const lobby of this.getLobbies().values()) {
            if (lobby.users.includes(userID)) {
                return true;
            }
        }
        return false;
    }

    private getLobbies(): Map<string, { id: string; users: number[]; host: number }> {
        if (!LocalLobbyDatabase.lobbies) {
            LocalLobbyDatabase.lobbies = new Map();
        }

        return LocalLobbyDatabase.lobbies;
    }
}
