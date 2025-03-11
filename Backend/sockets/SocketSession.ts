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
            // Create a new lobby with the current user as the host
            const lobbyId = await this.db.createLobby(this.userID);
            await this.socket.join(lobbyId); // Join the socket room for the lobby
            await this.updateLobbyMembers(lobbyId); // Emit the updated lobby state
            console.log(`Lobby created: ${lobbyId}`);
        } catch (error: any) {
            console.error("Error creating lobby:", error.message);
            this.socket.emit("lobbyError", error.message);
        }
    }

    async leaveLobby(lobbyId: string) {
        if (!this.userID) {
            throw new Error("User not authenticated");
        }
    
        try {
            console.log(`User ${this.userID} leaving lobby ${lobbyId}`);
    
            // Leave the lobby in the database
            await this.db.leaveLobby(lobbyId, this.userID);
    
            // Leave the socket room for the lobby
            await this.socket.leave(lobbyId);
    
            // After leaving, check if the lobby is empty
            const lobby = await this.db.getLobby(lobbyId);
            if (!lobby || lobby.users.length === 0) {
                console.log(`Lobby ${lobbyId} is empty and will be deleted`);
                // Delete the lobby if there are no members
                await this.db.leaveLobby(lobbyId, this.userID);  // This will also delete if empty
            }
    
            // Emit the updated lobby state to all clients in the lobby
            await this.updateLobbyMembers(lobbyId);
        } catch (error: any) {
            console.error(`Error leaving lobby: ${error.message}`);
            this.socket.emit("lobbyError", error.message);
        }
    }
    
    async joinLobby(lobbyId: string) {
        if (!this.userID) {
            throw new Error("User not authenticated");
        }
    
        try {
            console.log(`User ${this.userID} joining lobby ${lobbyId}`);
    
            // Ensure lobby exists before joining
            const lobby = await this.db.getLobby(lobbyId);
            if (!lobby) {
                throw new Error("Lobby does not exist");
            }
    
            // Join the lobby in the database
            await this.db.joinLobby(lobbyId, this.userID);
    
            // Join the socket room for the lobby
            await this.socket.join(lobbyId);
            console.log(`Socket ${this.socket.id} rooms:`, this.socket.rooms);
    
            // Emit the updated lobby state to all clients in the lobby
            await this.updateLobbyMembers(lobbyId);
        } catch (error: any) {
            console.error(`Error joining lobby: ${error.message}`);
            this.socket.emit("lobbyError", error.message);
        }
    }

    async disconnectUser() {
        if (!this.userID) {
            return;
        }

        // Find the lobby the user is in
        const lobbyId = Object.keys(this.socket.rooms).find(
            (room) => room !== this.socket.id
        );

        if (lobbyId) {
            // Leave the lobby when the user disconnects
            await this.leaveLobby(lobbyId);
        }
    }

    async updateLobbyMembers(lobbyId: string) {
        try {
            // Get the updated lobby object from the database
            const lobby = await this.db.getLobby(lobbyId);
    
            if (!lobby) {
                console.error(`Lobby ${lobbyId} not found. Skipping update.`);
                return; // Exit early if lobby doesn't exist
            }
    
            console.log("Updated lobby object:", lobby);
    
            // Emit the updated lobby state to all clients in the lobby
            io.to(lobbyId).emit("updateLobby", lobby);
        } catch (error: any) {
            console.error(`Error updating lobby members: ${error.message}`);
            this.socket.emit("lobbyError", error.message);
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
}