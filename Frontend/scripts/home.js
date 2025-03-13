import { refreshLogin } from "./refreshLogin.js";
import socket, { joinLobby } from "./socket.js";
import { logout, fetchAuth } from "./auth.js";
import url from "./url.js";

document.addEventListener("DOMContentLoaded", async () => {
    const isLoggedIn = await refreshLogin();
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }

    refreshLobby();
    populateUserWelcome()

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

    document.addEventListener("click", function(event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = "none"; // Hide the results
        }
    });

    await refreshDropdowns()
    });

async function refreshDropdowns() {
    const [dbUsers, friends] = await Promise.all([
        fetchUsers(),
        fetchAuth(`${url}/api/users/friends`, "GET")
    ]);

    document.getElementById("searchInput")
    .addEventListener("input", (event) => {
        searchUsers(event.target.value, dbUsers, friends);
    });
}

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

async function populateUserWelcome() {
    let currentUser = JSON.parse(localStorage.getItem("user"))
    let header = document.getElementById("welcome")
    header.innerText = `Welcome, ${currentUser.username}`
}
function addFriend(userId) {
    console.log("Adding friend with id: " + userId)
    fetchAuth(`${url}/api/users/send-friend-request`, "POST", {receiverId: userId})
}
function searchUsers(query, users, userFriends) {
    let resultsContainer = document.getElementById("searchResults");
    searchResults.style.display = "";
    resultsContainer.innerHTML = ""; // Clear previous results

    if (!query.trim()) return; // Don't show results if empty

    let filteredUsers = users.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));

    if (filteredUsers.length === 0) {
        resultsContainer.innerHTML = `<li class="list-group-item text-muted">No users found</li>`;
        return;
    }

    filteredUsers.forEach(user => {
        let userItem = document.createElement("li");
        userItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    
        // Create the container for user info
        let userInfoDiv = document.createElement("div");
        userInfoDiv.classList.add("d-flex", "flex-column", "text-truncate");
        userInfoDiv.style.maxWidth = "200px";  // Apply max-width dynamically
    
        // Create and append username
        let usernameStrong = document.createElement("strong");
        usernameStrong.textContent = user.username;  // Set the username
        userInfoDiv.appendChild(usernameStrong);
    
        // Create and append email
        let userEmailSmall = document.createElement("small");
        userEmailSmall.classList.add("text-muted");
        userEmailSmall.textContent = user.email;  // Set the email
        userInfoDiv.appendChild(userEmailSmall);
        
        let existingFriend = userFriends.find(f => f.id == user.id);
        let buttonText = "Add Friend";
        let enabled = true;
        if (existingFriend) {
            enabled = false;
            if (existingFriend.status === "Accepted") {
                buttonText = "Friends";  // User is already a friend
            } else if (existingFriend.status === "Pending") {
                buttonText = "Pending";  // Friend request is pending
            }
        }
    
        // Create the Add button
        let addButton = document.createElement("button");
        addButton.classList.add("btn", "btn-primary", "btn-sm", "flex-shrink-0");
        addButton.textContent = buttonText;  // Set button text
        addButton.disabled = !enabled;
    
        // Append the user info div and button to the userItem
        userItem.appendChild(userInfoDiv);
        userItem.appendChild(addButton);
    
        // Append the user item to the results container
        resultsContainer.appendChild(userItem);
    });
}
