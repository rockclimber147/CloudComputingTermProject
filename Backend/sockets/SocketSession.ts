import { Socket } from "socket.io";
import { LobbyDatabase, LocalLobbyDatabase } from "../modules/Databases.js";
import { io } from "../config/SocketServer.js";

export class SocketSession {
    socket: Socket;
    db: LobbyDatabase;
    userID: number | null;
    constructor(socket: Socket) {
        this.socket = socket;
        this.db = new LocalLobbyDatabase();
        this.userID = null;
    }

    setUserID(userID: number) {
        this.userID = userID;
    }

    async createLobby() {
        if (!this.userID) {
            throw new Error("User not authenticated");
        }

        try {
            const lobbyId = await this.db.createLobby(this.userID);
            await this.socket.join(lobbyId);
            await this.updateLobbyMembers(lobbyId);
        } catch (error: any) {
            console.log("error creating lobby",error);
            this.socket.emit("lobbyError", error.message);
            return;
        }
    }

    async joinLobby(lobbyId: string) {
        if (!this.userID) {
            throw new Error("User not authenticated");
        }

        try {
            await this.db.joinLobby(lobbyId, this.userID);
            await this.socket.join(lobbyId);
            await this.updateLobbyMembers(lobbyId);
        } catch (error: any) {
            this.socket.emit("lobbyError", error.message);
            return;
        }
    }

    async leaveLobby(lobbyId: string) {
        if (!this.userID) {
            throw new Error("User not authenticated");
        }

        try {
            await this.db.leaveLobby(lobbyId, this.userID);
            await this.socket.leave(lobbyId);
            await this.updateLobbyMembers(lobbyId);
        } catch (error: any) {
            this.socket.emit("lobbyError", error.message);
            return;
        }
    }

    async disconnectUser() {
        if (!this.userID) {
            return;
        }

        const lobbyId = Object.keys(this.socket.rooms).find(
            (room) => room !== this.socket.id
        );

        if (lobbyId) {
            await this.leaveLobby(lobbyId);
        }
    }

    async updateLobby(lobbyId: string) {
        try {
            const lobby = await this.db.getLobby(lobbyId);
            io.to(lobbyId).emit("updateLobby", lobby.members);
        } catch (error: any) {
            this.socket.emit("lobbyError", error.message);
            return;
        }
    }

    async leaveAllLobbies() {
        const lobbyIds = Object.keys(this.socket.rooms).filter(
            (room) => room !== this.socket.id
        );

        for (const lobbyId of lobbyIds) {
            await this.leaveLobby(lobbyId);
        }
    }

    private async updateLobbyMembers(lobbyId: string) {
        const lobby = await this.db.getLobby(lobbyId);
        console.log(lobby);

        io.to(lobbyId).emit("updateLobby", lobby);
    }
}
