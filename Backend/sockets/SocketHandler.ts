import { Socket } from "socket.io";
import { io } from "../config/SocketServer.js";
import { SocketSession } from "./SocketSession.js";
import { verifyToken } from "../modules/JwtUtils.js";

const socketConnections: { [key: string]: SocketSession } = {};

io.on("connection", async (socket: Socket) => {
    console.log("A user connected:", socket.id);
    socketConnections[socket.id] = new SocketSession(socket);

    // Create a lobby
    socket.on("createLobby", async (lobbyID: string) => {
        try {
            await socketConnections[socket.id].createLobby(lobbyID);
        } catch (error: any) {
            socket.emit("error", error.message);
            return;
        }
    });

    // Join a lobby
    socket.on("joinLobby", async (lobbyID: string) => {
        try {
            await socketConnections[socket.id].joinLobby(lobbyID);
        } catch (error: any) {
            socket.emit("error", error.message);
            return;
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

    socket.on("login", (token: string) => {
        try {
            const userID = verifyToken(token);
            socketConnections[socket.id].setUserID(userID);
        } catch (error: any) {
            console.log(error);
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
