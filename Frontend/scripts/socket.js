import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

//TODO: Change the URL to url saved at url.js
const socket = io("http://localhost:3000");

const token = localStorage.getItem("token");

if (!token) {
    alert("You need to login first");
    window.location.href = "index.html";
}

socket.on("connect", () => {
    console.log("Connected to server");
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.on("updateLobby", (lobby) => {
    console.log("✅ Received updateLobby event:", lobby);
    if (!lobby) {
        localStorage.removeItem("lobby");
    } else {
        localStorage.setItem("lobby", JSON.stringify(lobby));
        updateLobbyUI(lobby);
    }
});

//TODO: Add a text box or something for the error instead of alert
socket.on("error", (error) => {
    alert(error);
});

export function createLobby() {
    socket.emit("createLobby");
}

export function joinLobby(lobbyId) {
    const currentLobby = localStorage.getItem("lobby");
    if (currentLobby) {
        console.log("Leaving current lobby before joining a new one");
        socket.emit("leaveLobby", JSON.parse(currentLobby).id);
        localStorage.removeItem("lobby");
        // Wait for a short time before sending joinLobby event for the new lobby
        setTimeout(() => {
            console.log("Sending joinLobby event for lobby:", lobbyId);
            socket.emit("joinLobby", lobbyId);
        }, 500); // Adjust the delay as needed
    } else {
        console.log("Sending joinLobby event for lobby:", lobbyId);
        socket.emit("joinLobby", lobbyId);
    }
}

export function leaveLobby() {
    socket.emit("leaveLobby");
}

function updateLobbyUI(lobby) {
    const lobbyInfo = document.getElementById("lobby-info");
    if (!lobby || !lobby.users) {
        console.error("Invalid lobby data:", lobby);
        return;
    }
    const playerList = lobby.users.map(user => `Player ${user}`).join(", ");
    if (lobbyInfo) {
        lobbyInfo.innerHTML = `<p><strong>Lobby ID:</strong> ${lobby.id || "Unknown"}</p>
                                <p><strong>Host:</strong> Player ${lobby.host}</p>
                               <p><strong>Players:</strong> ${playerList || "No players yet"}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    socket.emit("login", token);
    createLobby();
});
