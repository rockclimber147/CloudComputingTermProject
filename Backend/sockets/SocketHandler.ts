import { Socket } from "socket.io";
import { io } from "../config/SocketServer.js";
import { SocketSession } from "./SocketSession.js";
import { verifyToken } from "../modules/JwtUtils.js";

export const socketConnections: { [key: string]: SocketSession } = {};

io.on("connection", async (socket: Socket) => {
    console.log("A user connected:", socket.id);
    socketConnections[socket.id] = new SocketSession(socket);

    // Create a lobby
    socket.on("createLobby", async () => {
        try {
            await socketConnections[socket.id].createLobby();
        } catch (error: any) {
            console.log("error creating lobby", error);
            socket.emit("error", error.message);
            return;
        }
    });

    // Join a lobby
    socket.on("joinLobby", async (lobbyID: string) => {
        console.log("Join lobby request", lobbyID);
        try {
            await socketConnections[socket.id].joinLobby(lobbyID);
            console.log("Joined lobby", lobbyID);
        } catch (error: any) {
            console.log("error joining lobby", error);
            socket.emit("error", error.message);
            return;
        }
    });

    // Leave a lobby
    socket.on("leaveLobby", async () => {
        console.log("Leave lobby request", socket.id);
        try {
            await socketConnections[socket.id].leaveLobby();
            await socketConnections[socket.id].createLobby();
        } catch (error: any) {
            console.log("error leaving lobby", error);
            socket.emit("error", error.message);
            return;
        }
    });

    socket.on("login", async (token: string) => {
        console.log("Login with token", token);

        try {
            const userID = await verifyToken(token);
            socketConnections[socket.id].setUserID(userID);
        } catch (error: any) {
            console.log("Error verifying token", error);
            socket.emit("error", error.message);
            return;
        }
    });

    socket.on("setGameId", async (gameId: string) => {
        if (!socketConnections[socket.id].hasGameId()) {
            console.log("setting game id", gameId);
            socketConnections[socket.id].setGameID(gameId);
        }
    });

    socket.on("unsetGameId", async () => {
        console.log("unsetGameId");
        socketConnections[socket.id].unsetGameID();
    });

    socket.on("startGame", async (gameType: number) => {
        console.log("Game start request", gameType);
        
        try {
            // Create a game
            await socketConnections[socket.id].emitGameType(gameType)
            await socketConnections[socket.id].createGame(gameType);
            console.log("Game created");
        } catch (error: any) {
            console.log("error creating game", error);
            socket.emit("error", error.message);
            return;
        }
    });

    socket.on("gameMakeMove", async (index: number) => {
        try {
            // Create a game
            await socketConnections[socket.id].makeMove(index);
        } catch (error: any) {
            console.log("error makeing move", error);
            socket.emit("error", error.message);
            return;
        }
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
        try {
            console.log(`User ${socket.id} disconnected`);
            await socketConnections[socket.id].gameOver(null)
            await socketConnections[socket.id].leaveLobby();
            delete socketConnections[socket.id];
        } catch (error: any) {
            console.log(error);
        }
    });
});
