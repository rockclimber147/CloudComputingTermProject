import crypto from "crypto";
import { Socket } from "socket.io";
import { io } from "../config/SocketServer.js";
import { SocketSession } from "./SocketSession.js";
import { verifyToken } from "../modules/JwtUtils.js";

const socketConnections: { [key: string]: SocketSession } = {};

io.on("connection", async (socket: Socket) => {
    console.log("A user connected:", socket.id);
    // Ensure socket session is created
    if (!socketConnections[socket.id]) {
        console.log(`ℹ️ Creating new SocketSession for ${socket.id}`);
        socketConnections[socket.id] = new SocketSession(socket);
    }   

    socket.onAny((event, ...args) => {
        console.log(`📥 Received event: ${event}`, args);
    });

    // Create a lobby
    socket.on("createLobby", async () => {
        console.log("Create lobby");

        try {
            await socketConnections[socket.id].createLobby();
        } catch (error: any) {
            console.log("error creating lobby", error);

            socket.emit("error", error.message);
            return;
        }
    });

    console.log(`Current socketConnections:`, Object.keys(socketConnections));
    // Join a lobby
    socket.on("joinLobby", async (lobbyID: string) => {
        console.log(`✅ Server received joinLobby event for lobby ID: ${lobbyID}`);

        if (!socketConnections[socket.id]) {
            console.error(`❌ No socket session found for socket ID: ${socket.id}`);
            return;
        }

        try {
            await socketConnections[socket.id].joinLobby(lobbyID);
            console.log("try", lobbyID)
        } catch (error: any) {
            console.error(`❌ Error in joinLobby: ${error.message}`);
            socket.emit("error", error.message);
        }
    });
    
    // Leave a lobby
    socket.on("leaveLobby", async (lobbyID: string) => {
        try {
            await socketConnections[socket.id].leaveLobby(lobbyID);
        } catch (error: any) {
            socket.emit("error", error.message);
            return;
        }
    });

    socket.on("login", async (token: string) => {
        console.log("Login with token", token);
        
        try {
            const userID = verifyToken(token);
            socketConnections[socket.id].setUserID(userID);
            await socketConnections[socket.id].createLobby();
        } catch (error: any) {
            console.log("Error verifying token", error);
            socket.emit("error", error.message);
            return;
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        try {
            console.log(`User ${socket.id} disconnected`);
            socketConnections[socket.id].disconnectUser();
            delete socketConnections[socket.id];
        } catch (error: any) {
            console.log(error);
        }
    });
});
