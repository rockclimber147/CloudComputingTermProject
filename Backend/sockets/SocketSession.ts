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

        const lobbyId = await this.db.createLobby(this.userID);
        await this.socket.join(lobbyId);
        console.log(this.socket.rooms);
        await this.updateLobbyMembers(lobbyId);
    }

    async joinLobby(lobbyId: string) {
        if (!this.userID) {
            throw new Error("User not authenticated");
        }

        await this.leaveAllLobbies();
        await this.db.joinLobby(lobbyId, this.userID);
        await this.socket.join(lobbyId);
        await this.updateLobbyMembers(lobbyId);
    }

    async leaveLobby(lobbyId: string) {
        if (!this.userID) {
            throw new Error("User not authenticated");
        }

        await this.db.leaveLobby(lobbyId, this.userID);
        await this.socket.leave(lobbyId);
        await this.updateLobbyMembers(lobbyId);
    }

    async updateLobby(lobbyId: string) {
        const lobby = await this.db.getLobby(lobbyId);
        io.to(lobbyId).emit("updateLobby", lobby.members);
    }

    async leaveAllLobbies() {
        if (!this.userID) {
            throw new Error("User not authenticated");
        }

        const lobbyIds = [];
        for (const room of this.socket.rooms) {
            if (room !== this.socket.id) {
                lobbyIds.push(room);
            }
        }

        console.log("Leaving lobbies", lobbyIds);

        for (const lobbyId of lobbyIds) {
            await this.leaveLobby(lobbyId);
        }
    }

    private async updateLobbyMembers(lobbyId: string) {
        const lobby = await this.db.getLobby(lobbyId);
        console.log(lobby);
        this.db.printLobbies();

        io.to(lobbyId).emit("updateLobby", lobby);
    }
}
