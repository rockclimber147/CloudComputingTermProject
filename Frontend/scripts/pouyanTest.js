import socket, { joinLobby } from "./socket.js";

document.addEventListener("DOMContentLoaded", async () => {
    refreshLobby();

    const joinLobbyButton = document.querySelector("#join-lobby");
    const startGameButton = document.querySelector("#start-game");

    joinLobbyButton.addEventListener("click", (event) => {
        event.preventDefault();
        
        const lobbyId = document.getElementById("lobby-id").value;
        if (!lobbyId) {
            alert("Please enter a lobby id");
            return;
        }

        joinLobby(lobbyId);
    });

    startGameButton.addEventListener("click", (event) => {
        event.preventDefault();
        const users = getLobbyUsers();
        if (users && users.length != 2) {
            alert("Lobby has to have two people to play tic tac toe");
            return;
        }

        const host = getHost();
        if (!host) {
            console.log(host);
            alert("Could not find host");
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("user"));
        
        if (!(currentUser.id === host.id)) {
            alert("Only the host can start the game");
            return;
        }

        socket.emit("startGame", 0);
    });

    socket.on("updateLobby", () => {
        refreshLobby();
    });
});

function getLobbyUsers() {
    const lobby = localStorage.getItem("lobby");
    if (!lobby) {
        return null;
    }

    return JSON.parse(lobby).users;
}

function getHost() {
    const lobby = localStorage.getItem("lobby");
    if (!lobby) {
        return null;
    }
    const lobbyJson = JSON.parse(lobby);

    const users = lobbyJson.users;
    
    return users.filter((user) => user.id == lobbyJson.host)[0];
}

function refreshLobbyUsers() {
    const users = getLobbyUsers();
    if (!users) {
        return;
    }
    
    const userList = document.getElementById("lobby-users");
    userList.innerHTML = "";
    users.forEach((user) => {
        const userElement = document.createElement("li");
        userElement.textContent = user.username;
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

