import { Socket } from "socket.io";
import { io } from "../config/SocketServer.js";
import { SocketSession } from "./SocketSession.js";
import { verifyToken } from "../modules/JwtUtils.js";

const socketConnections: { [key: string]: SocketSession } = {};

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
    socket.on("leaveLobby", async (lobbyID: string) => {
        console.log("Leave lobby request", lobbyID);
        try {
            await socketConnections[socket.id].leaveLobby(lobbyID);
        } catch (error: any) {
            console.log("error leaving lobby", error);
            socket.emit("error", error.message);
            return;
        }
    });

    socket.on("login", (token: string) => {
        console.log("Login with token", token);

        try {
            const userID = verifyToken(token);
            socketConnections[socket.id].setUserID(userID);
        } catch (error: any) {
            console.log("Error verifying token", error);
            socket.emit("error", error.message);
            return;
        }
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
        try {
            console.log(`User ${socket.id} disconnected`);
            delete socketConnections[socket.id];
        } catch (error: any) {
            console.log(error);
        }
    });
});
