import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import url from "./url.js";
import { refreshDropdowns } from "./home.js";

const socket = io(url);

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You need to login first");
        window.location.href = "index.html";
    }

    socket.on("connect", async () => {
        console.log("Connected to server");
        await socket.emitWithAck("login", token);
        createLobby();
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from server");
    });

    socket.on("updateLobby", (lobbies) => {
        console.log("Lobbies updated", lobbies);

        if (lobbies == null) {
            localStorage.removeItem("lobby");
        }
        localStorage.setItem("lobby", JSON.stringify(lobbies));
    });

    socket.on("updateFriends", async () => {
        await refreshDropdowns()
    });

    //TODO: Add a text box or something for the error instead of alert
    socket.on("error", (error) => {
        alert(error);
    });
});

export function createLobby() {
    socket.emit("createLobby");
}

export function joinLobby(lobbyId) {
    socket.emit("joinLobby", lobbyId);
}

export class SocketEmitEnums {
    static GAME_MAKE_MOVE = "gameMakeMove"
    static UNSET_GAME_ID = "unsetGameId"
    static SET_GAME_ID = "setGameId"
}

export class SocketListenEnums {
    static UPDATE_GAME = "updateGame"
    static GAME_OVER = "gameOver"
}

export default socket;

