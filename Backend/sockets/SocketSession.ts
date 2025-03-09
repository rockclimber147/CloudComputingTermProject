import { Socket } from 'socket.io';
import { LobbyDatabase, RedisDatabase } from '../modules/Databases.js';
import { io } from '../config/SocketServer.js';

export class SocketSession {
    socket: Socket;
    db: LobbyDatabase;
    userID: string | null;
    constructor(socket: Socket) {
        this.socket = socket;
        this.db = new RedisDatabase();
        this.userID = null;
    }

    setUserID(userID: string) {
        this.userID = userID;
    }

    async createLobby(lobbyId: string) {
        if (!this.userID) {
            throw new Error('User not authenticated');
        }

        try {
            await this.db.createLobby(lobbyId, this.userID);
            await this.socket.join(lobbyId);
            await this.updateLobbyMembers(lobbyId);
        } catch (error: any) {
            this.socket.emit('lobbyError', error.message);
            return;
        }
    }

    async joinLobby(lobbyId: string) {
        if (!this.userID) {
            throw new Error('User not authenticated');
        }

        try {
            await this.db.joinLobby(lobbyId, this.userID);
            await this.socket.join(lobbyId);
            await this.updateLobbyMembers(lobbyId);
        } catch (error: any) {
            this.socket.emit('lobbyError', error.message);
            return;
        }
    }

    async leaveLobby(lobbyId: string) {
        if (!this.userID) {
            throw new Error('User not authenticated');
        }

        try {
            await this.db.leaveLobby(lobbyId, this.userID);
            await this.socket.leave(lobbyId);
            await this.updateLobbyMembers(lobbyId);
        } catch (error: any) {
            this.socket.emit('lobbyError', error.message);
            return;
        }
    }

    async disconnectUser() {
        if (!this.userID) {
            return;
        }
        const user = await this.db.getUser(this.userID);

        if (user.lobbyId) {
            await this.db.leaveLobby(user.lobbyId, this.userID);
        }
    }

    async updateLobby(lobbyId: string) {
        try {
            const lobby = await this.db.getLobby(lobbyId);
            io.to(lobbyId).emit('updateLobby', lobby.members);
        } catch (error: any) {
            this.socket.emit('lobbyError', error.message);
            return;
        }
    }

    private async updateLobbyMembers(lobbyId: string) {
        const lobbyMembers = await this.db.getLobbyMembers(lobbyId);
        console.log(lobbyMembers);

        io.to(lobbyId).emit('updateLobby', lobbyMembers);
    }
}
