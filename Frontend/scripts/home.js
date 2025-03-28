import { refreshLogin } from "./refreshLogin.js";
import socket, { joinLobby } from "./socket.js";
import { logout, fetchAuth, adminRolesEnum } from "./auth.js";
import url from "./url.js";
import { TicTacToeHandler } from "./TicTacToeRefactored.js";
import { PONGHandler } from "./PONG.js";

document.addEventListener("DOMContentLoaded", async () => {
    const isLoggedIn = await refreshLogin();
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }

    let currentGame;

    socket.on("setGame", (game) => {
        console.log("in setGame")
        console.log(game)

        if (currentGame) {
            currentGame.destroy();
            currentGame = null; // Clear reference
        }

        if (game == 0){
            console.log("Tic tac toe init")
            currentGame = new TicTacToeHandler()
        }
        else if (game == 1){
            console.log("PONG init")
            currentGame = new PONGHandler("PONG-Canvas")
        }
        currentGame.startGame()
    })

    refreshLobby();
    populateUserWelcome()
    addAdminButton()

    let selectedGameId = 0; // Default to Tic Tac Toe
    

    document.getElementById("game-selection").addEventListener("change", (event) => {
        selectedGameId = parseInt(event.target.value, 10);
        console.log("Selected game ID:", selectedGameId);
    });


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
        console.log("Starting game")
        console.log(selectedGameId)
        socket.emit("startGame", selectedGameId);
        console.log(currentGame)
    });

    socket.on("updateLobby", () => {
        refreshLobby();
    });

    const logoutLink = document.getElementById("logout")
    logoutLink?.addEventListener("click", async (event) => {
        event.preventDefault();
        await logout()

    });

    document.addEventListener("click", function (event) {
        if (
            !searchInput.contains(event.target) &&
            !searchResults.contains(event.target)
        ) {
            searchResults.style.display = "none"; // Hide the results
        }
    });

    await refreshDropdowns();
});

async function refreshDropdowns() {
    let loggedInId = JSON.parse(localStorage.getItem("user")).id;
    const [allUsers, allFriendRequests] = await Promise.all([
        fetchUsers(),
        fetchAuth(`${url}/api/users/friends`, "GET"),
    ]);

    const dbUsers = allUsers.filter((u) => u.id != loggedInId);
    const userMap = new Map();
    dbUsers.forEach((user) => {
        userMap.set(user.id, user); // Use user ID as the key
    });
    const receivedRequests = allFriendRequests.filter(
        (f) => f.receiverID == loggedInId
    );
    document.getElementById("friendsDropdown").addEventListener(
        "click",
        populateFriendsDropdown(
            allFriendRequests.filter((u) => u.status == "Accepted"),
            userMap
        )
    );

    document.getElementById("friend-panel-toggle").addEventListener("click", () =>
        populateRequestsDropdown(
            receivedRequests.filter((u) => u.status == "Pending"),
            userMap
        )
    );

    document.getElementById("searchInput").addEventListener("input", (event) => {
        searchUsers(event.target.value, userMap, allFriendRequests);
    });

    const query = document.getElementById("searchInput").value.trim();
    if (query) {
        searchUsers(query, userMap, allFriendRequests); // Reapply search with updated data
    }
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
        userList.innerHTML =
            '<p class="text-muted text-center">Waiting for players...</p>';
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

function populateFriendsDropdown(friends, userMap) {

    let dropdown = document.getElementById("friendsList");
    let friendsList = document.getElementById("friend-list"); // Target the friends list section

    dropdown.innerHTML = ""; // Clear existing content
    friendsList.innerHTML = ""; // Clear existing content

    if (friends.length === 0) {
        dropdown.innerHTML = `<li><span class="dropdown-item-text text-muted">No friends found</span></li>`;
        friendsList.innerHTML = `<li class="list-group-item text-muted">No friends found</li>`;
      
        let user = getUserForRequest(userMap, friend)
        let friendDropdownItem = `

            <li>
                <div class="dropdown-item">
                    <strong>${user.username}</strong><br>
                    <small class="text-muted">${user.email}</small>
                </div>
            </li>
            <li><hr class="dropdown-divider"></li>
        `;
        dropdown.innerHTML += friendDropdownItem;

        // Populate friends list section
        let friendListItem = `
            <li class="list-group-item">
                <strong>${user.username}</strong><br>
                <small class="text-muted">${user.email}</small>
            </li>
        `;
        friendsList.innerHTML += friendListItem;
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

async function addFriend(userId) {
    await fetchAuth(`${url}/api/users/send-friend-request`, "POST", {receiverId: userId})
 
    refreshDropdowns();
}

// Helper function to create a user info div
function createUserInfoDiv(username, email) {
    let userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("d-flex", "flex-column", "text-truncate");

    let usernameStrong = document.createElement("strong");
    usernameStrong.textContent = username;
    userInfoDiv.appendChild(usernameStrong);

    let userEmailSmall = document.createElement("small");
    userEmailSmall.classList.add("text-muted");
    userEmailSmall.textContent = email;
    userInfoDiv.appendChild(userEmailSmall);

    return userInfoDiv;
}

// Helper function to create a button
function createButton(text, classNames, clickHandler, disabled = false) {
    let button = document.createElement("button");
    button.classList.add("btn", "btn-sm", ...classNames);
    button.textContent = text;
    button.addEventListener("click", clickHandler);
    button.disabled = disabled;

    return button;
}

// Refactored searchUsers function
function searchUsers(query, usermap, userFriends) {
    let resultsContainer = document.getElementById("searchResults");
    resultsContainer.style.display = "";
    resultsContainer.innerHTML = ""; // Clear previous results

    if (!query.trim()) return; // Don't show results if empty

    let filteredUsers = [...usermap.values()].filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredUsers.length === 0) {
        resultsContainer.innerHTML = `<li class="list-group-item text-muted">No users found</li>`;
        return;
    }

    filteredUsers.forEach((user) => {
        let userItem = document.createElement("li");
        userItem.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center"
        );

        let userInfoDiv = createUserInfoDiv(user.username, user.email);

        // Determine button text and enable state
        let existingFriend = userFriends.find(
            (f) => f.senderID == user.id || f.receiverID == user.id
        );
        let buttonText = "Add Friend";
        let enabled = true;
        if (existingFriend) {
            enabled = false;
            if (existingFriend.status === "Accepted") {
                buttonText = "Friends";
            } else if (existingFriend.status === "Pending") {
                buttonText = "Pending";
            }
        }

        let addButton = createButton(
            buttonText,
            ["btn-primary", "flex-shrink-0"],
            () => addFriend(user.id),
            !enabled
        );

        userItem.appendChild(userInfoDiv);
        userItem.appendChild(addButton);
        resultsContainer.appendChild(userItem);
    });
}

// Refactored populateRequestsDropdown function
function populateRequestsDropdown(requests, userMap) {
    let dropdown = document.getElementById("friend-requests");
    dropdown.innerHTML = ""; // Clear existing content

    if (requests.length === 0) {
        dropdown.innerHTML = `
            <li class="list-group-item text-center text-muted d-flex flex-column align-items-center">
                <i class="fas fa-user-friends fa-2x mb-2"></i>
                <p class="mb-0">No pending friend requests</p>
            </li>
        `;
        return;
    }

    requests.forEach((request) => {
        let user = getUserForRequest(userMap, request);

        let requestCard = document.createElement("li");
        requestCard.classList.add(
            "list-group-item",
            "d-flex",
            "flex-column",
            "align-items-start"
        );

        let userInfoDiv = createUserInfoDiv(user.username, user.email);

        let buttonDiv = document.createElement("div");
        buttonDiv.classList.add("d-flex", "justify-content-end", "mt-2", "gap-2");

        let acceptButton = createButton("Accept", ["btn-success"], () =>
            acceptRequest(request.senderID)
        );
        let declineButton = createButton("Reject", ["btn-danger"], () =>
            rejectRequest(request.senderID)
        );

        buttonDiv.appendChild(acceptButton);
        buttonDiv.appendChild(declineButton);

        requestCard.appendChild(userInfoDiv);
        requestCard.appendChild(buttonDiv);

        dropdown.appendChild(requestCard);
    });
}

function getUserForRequest(usermap, friend) {
    let loggedInId = JSON.parse(localStorage.getItem("user")).id;
    let send = friend.senderID;
    let receive = friend.receiverID;
    let userId;

    if (send !== loggedInId) {
        userId = send;
    } else {
        userId = receive;
    }
    return usermap.get(userId)
}

async function acceptRequest(userId) {
    try {
        await fetchAuth(`${url}/api/users/accept-friend-request`, "POST", { senderID: userId });

        alert("Friend request accepted!");
        refreshDropdowns(); // Refresh the dropdowns to update the status
    } catch (error) {
        console.error("Error accepting friend request:", error);
    }
}

async function rejectRequest(userId) {
    try {
        await fetchAuth(`${url}/api/users/reject-friend-request`, "POST", {
            senderID: userId,
        });
        alert("Friend request declined!");
        refreshDropdowns(); // Refresh the dropdowns to update the status
    } catch (error) {
        console.error("Error declining friend request:", error);
    }
}


const toggleButton = document.getElementById("friend-panel-toggle");
const friendPanel = document.getElementById("friend-panel");

toggleButton.addEventListener("click", () => {
    const isVisible = friendPanel.style.display === "block";
    friendPanel.style.display = isVisible ? "none" : "block";
});

document.getElementById("close-friend-panel").addEventListener("click", () => {
    document.getElementById("friend-panel").style.display = "none";
});

async function addAdminButton() {
    const user = localStorage.getItem("user");
    console.log(user)

    let userIsAdmin = JSON.parse(user).roles.find(role => role == adminRolesEnum.ADMIN)

    if (userIsAdmin) {
        const adminNavItem = document.createElement("li");
        adminNavItem.classList.add("nav-item");
        adminNavItem.innerHTML = `<a class="nav-link text-warning" href="admin.html">Admin Console</a>`;
        document.getElementById("adminConsoleLink").replaceWith(adminNavItem);
    }
}

