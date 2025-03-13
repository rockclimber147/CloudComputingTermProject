import { refreshLogin } from "./refreshLogin.js";
import socket, { joinLobby } from "./socket.js";
import { logout } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const isLoggedIn = await refreshLogin();
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }

    refreshLobby();

    const joinLobbyButton = document.getElementById("join-lobby-btn");
    const startGameButton = document.getElementById("start-game-btn");


    joinLobbyButton.addEventListener("click", (event) => {
        event.preventDefault();
        const lobbyId = document.getElementById("lobby-id-input").value;
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

    console.log("here")

    const logoutLink = document.getElementById("logout")
    logoutLink?.addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("logout clicked")
        await logout()
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

    if (users.length === 0) {
        userList.innerHTML = '<p class="text-muted text-center">Waiting for players...</p>';
        return;
    }

    users.forEach((user) => {
        const userElement = document.createElement("div");
        userElement.className = "player-card card p-2 mb-2 shadow-sm text-center";
        userElement.innerHTML = `<strong>${user.username}</strong>`;
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

function getHost() {
    const lobby = localStorage.getItem("lobby");
    if (!lobby) {
        return null;
    }
    const lobbyJson = JSON.parse(lobby);

    const users = lobbyJson.users;
    
    return users.filter((user) => user.id == lobbyJson.host)[0];
}


function refreshLobby() {
    refreshLobbyUsers();
    refreshLobbyID();
}


