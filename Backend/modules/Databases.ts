import redis from '../config/RedisStartup.js';

export abstract class LobbyDatabase {
    abstract connect(): void;
    //! get rid of this and put it in the user database class
    abstract getUser(userId: string): Promise<any>;
    abstract createLobby(lobbyId: string, host: string): Promise<void>;
    abstract joinLobby(lobbyId: string, userId: string): Promise<void>;
    abstract leaveLobby(lobbyId: string, userId: string): Promise<void>;
    abstract getLobby(lobbyId: string): Promise<any>;
    abstract getLobbyMembers(lobbyId: string): Promise<string[]>;
}

export class RedisDatabase extends LobbyDatabase {
    connect(): void {
        redis.connect();
    }
    getUser(userId: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    createLobby(lobbyId: string, host: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    joinLobby(lobbyId: string, userId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    leaveLobby(lobbyId: string, userId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getLobby(lobbyId: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    getLobbyMembers(lobbyId: string): Promise<string[]> {
        throw new Error('Method not implemented.');
    }
}
