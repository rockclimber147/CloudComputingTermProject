import { refreshLogin } from "./refreshLogin.js";

document.addEventListener("DOMContentLoaded", async () => {
    const isLoggedIn = await refreshLogin();
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
});

import { joinLobby } from "./socket.js";
        
        document.getElementById("join-lobby-btn").addEventListener("click", () => {
            const lobbyId = document.getElementById("lobby-id-input").value.trim();
            if (lobbyId) {
                console.log("Attempting to join lobby:", lobbyId);
                joinLobby(lobbyId);
            } else {
                alert("Please enter a valid Lobby ID");
            }
        });