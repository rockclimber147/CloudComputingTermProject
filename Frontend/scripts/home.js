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

    document.getElementById("friendsDropdown")
    .addEventListener("click", populateFriendsDropdown(
        friends.filter(u => u.status == "Accepted")
    ));

    document.getElementById("requestsDropdown")
    .addEventListener("click", () => populateRequestsDropdown(
        friends.filter(u => u.status == "Pending")
    ));


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

function populateFriendsDropdown(users) {
    console.log(users)
    let dropdown = document.getElementById("friendsList");
    dropdown.innerHTML = ""; // Clear existing content

    if (users.length === 0) {
        dropdown.innerHTML = `<li><span class="dropdown-item-text text-muted">No friends found</span></li>`;
        return;
    }

    users.forEach(user => {
        let friendCard = `
            <li>
                <div class="dropdown-item">
                    <strong>${user.username}</strong><br>
                    <small class="text-muted">${user.email}</small>
                </div>
            </li>
            <li><hr class="dropdown-divider"></li>
        `;
        dropdown.innerHTML += friendCard;
    });
}

async function fetchUsers() {
    try {
        const response = await fetchAuth(`${url}/api/users`, "GET");
        return response;
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function addFriend(userId) {
    console.log("Adding friend with id: " + userId)
    fetchAuth(`${url}/api/users/send-friend-request`, "POST", {receiverId: userId})
}

function acceptFriend(userID) {
    fetchAuth(`${url}/api/users/accept-friend-request`, "POST", {receiverId: userId})
    refreshDropdowns()
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

function populateRequestsDropdown(requests) {
    let dropdown = document.getElementById("requestsList");
    dropdown.innerHTML = ""; // Clear existing content

    if (requests.length === 0) {
        dropdown.innerHTML = `<li><span class="dropdown-item-text text-muted">No pending requests</span></li>`;
        return;
    }

    requests.forEach(request => {
        let requestCard = document.createElement("li");
        requestCard.classList.add("dropdown-item");

        // Create user info
        let userInfoDiv = document.createElement("div");
        userInfoDiv.classList.add("d-flex", "flex-column", "text-truncate");

        let usernameStrong = document.createElement("strong");
        usernameStrong.textContent = request.username;
        userInfoDiv.appendChild(usernameStrong);

        let emailSmall = document.createElement("small");
        emailSmall.classList.add("text-muted");
        emailSmall.textContent = request.email;
        userInfoDiv.appendChild(emailSmall);

        // Create Accept and Decline buttons
        let acceptButton = document.createElement("button");
        acceptButton.classList.add("btn", "btn-success", "btn-sm", "mr-2");
        acceptButton.textContent = "Accept";
        acceptButton.addEventListener("click", () => acceptRequest(request.id));

        let declineButton = document.createElement("button");
        declineButton.classList.add("btn", "btn-danger", "btn-sm");
        declineButton.textContent = "Reject";
        declineButton.addEventListener("click", () => rejectRequest(request.id));

        // Create a div to hold the buttons
        let buttonDiv = document.createElement("div");
        buttonDiv.classList.add("d-flex", "justify-content-end");
        buttonDiv.appendChild(acceptButton);
        buttonDiv.appendChild(declineButton);

        // Add everything to the request card
        requestCard.appendChild(userInfoDiv);
        requestCard.appendChild(buttonDiv);

        // Append the request card to the dropdown
        dropdown.appendChild(requestCard);
    });
}

async function acceptRequest(userId) {
    try {
        await fetchAuth(`${url}/api/users/accept-friend-request`, "POST", { receiverId: userId });
        alert("Friend request accepted!");
        refreshDropdowns(); // Refresh the dropdowns to update the status
    } catch (error) {
        console.error("Error accepting friend request:", error);
    }
}


async function rejectRequest(userId) {
    try {
        await fetchAuth(`${url}/api/users/reject-friend-request`, "POST", { receiverId: userId });
        alert("Friend request declined!");
        refreshDropdowns(); // Refresh the dropdowns to update the status
    } catch (error) {
        console.error("Error declining friend request:", error);
    }
}
