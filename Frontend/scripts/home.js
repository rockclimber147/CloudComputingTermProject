import { refreshLogin } from "./refreshLogin.js";
import socket, { joinLobby } from "./socket.js";

document.addEventListener("DOMContentLoaded", async () => {
    const isLoggedIn = await refreshLogin();
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    refreshLobby();

    const joinLobbyButton = document.getElementById("join-lobby-btn");

    joinLobbyButton.addEventListener("click", (event) => {
        event.preventDefault();
        const lobbyId = document.getElementById("lobby-id-input").value;
        if (!lobbyId) {
            alert("Please enter a lobby id");
            return;
        }

        joinLobby(lobbyId);
    });

    socket.on("updateLobby", () => {
        refreshLobby();
    });
});

function getLobbyUsers() {
    const lobby = localStorage.getItem("lobby");
    if (!lobby) {
        return [];
    }

    return JSON.parse(lobby).users;
}

function refreshLobbyUsers() {
    const users = getLobbyUsers();
    
    const userList = document.getElementById("lobby-users");
    userList.innerHTML = ""; // Clear previous entries

    if (users.length === 0) {
        userList.innerHTML = '<p class="text-muted text-center">Waiting for players...</p>';
        return;
    }

    users.forEach((user) => {
        const userElement = document.createElement("div");
        userElement.className = "player-card card p-2 mb-2 shadow-sm text-center";
        userElement.innerHTML = `<strong>${user}</strong>`;
        userList.appendChild(userElement);
    });
}

function refreshLobbyID() {
    const lobby = localStorage.getItem("lobby");
    if (!lobby) {
        return;
    }

    const lobbyId = JSON.parse(lobby).id;
    
    document.getElementById("lobby-id-text").textContent = lobbyId;
}

function refreshLobby() {
    refreshLobbyUsers();
    refreshLobbyID();
}

