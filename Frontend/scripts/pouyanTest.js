import socket, { joinLobby } from "./socket.js";

document.addEventListener("DOMContentLoaded", async () => {
    refreshLobby();

    const joinLobbyButton = document.querySelector("#join-lobby");

    joinLobbyButton.addEventListener("click", (event) => {
        event.preventDefault();
        const lobbyId = document.getElementById("lobby-id").value;
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
    userList.innerHTML = "";
    users.forEach((user) => {
        const userElement = document.createElement("li");
        userElement.textContent = user;
        userList.appendChild(userElement);
    });
}

function refreshLobbyID() {
    const lobby = localStorage.getItem("lobby");
    if (!lobby) {
        return;
    }

    const lobbyId = JSON.parse(lobby).id;
    
    document.getElementById("current-lobby-id").textContent = lobbyId;
}

function refreshLobby() {
    refreshLobbyUsers();
    refreshLobbyID();
}

