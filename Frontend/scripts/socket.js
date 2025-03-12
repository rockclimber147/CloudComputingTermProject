import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import url from "./url.js";

const socket = io("url");

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You need to login first");
        window.location.href = "index.html";
    }

    socket.on("connect", () => {
        console.log("Connected to server");
        socket.emit("login", token);
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

export default socket;

