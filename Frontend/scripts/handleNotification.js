import socket, { joinLobby } from "./socket.js";
import { acceptRequest, rejectRequest } from "./friendRequest.js";

const NotificationType = {
    0: handleSimpleNotification, // sent request confirmations
    1: handleReceivedFriendRequestNotification,
    2: handleSimpleNotification, // accept request
    3: handleSimpleNotification, // reject request
    4: handleLobbyInviteNotification
};

socket.on("showNotification", async (notificationInfo) => {
    await showNotification(notificationInfo);
});

// notification should have a title, userWhoSendIt, message, action
async function showNotification(notificationInfo) {
    await NotificationType[notificationInfo.type](notificationInfo);
}

function createNotification(notificationInfo, actions = []) {
    const template = document.getElementById("notification-template");
    const notificationContainer = document.getElementById("notification-container");

    // Clone the template content
    const notificationElement = template.content
        .cloneNode(true)
        .querySelector(".notification");

    // Populate the notification content
    notificationElement.querySelector(".notification-title").textContent =
        notificationInfo.title;
    notificationElement.querySelector(".notification-text").textContent =
        notificationInfo.text;

    // Add actions (e.g., buttons)
    const actionsContainer = notificationElement.querySelector(".notification-actions");
    actions.forEach(({ label, onClick }) => {
        const button = document.createElement("button");
        button.textContent = label;
        button.addEventListener("click", onClick);
        actionsContainer.appendChild(button);
    });

    // Append the notification to the container
    notificationContainer.appendChild(notificationElement);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
        if (notificationContainer.contains(notificationElement)) {
            notificationContainer.removeChild(notificationElement);
        }
    }, 5000);
}

async function handleSendFriendRequestNotification(notificationInfo) {
    createNotification(notificationInfo);
}

async function handleSimpleNotification(notificationInfo) {
    createNotification(notificationInfo);
}

async function handleReceivedFriendRequestNotification(notificationInfo) {
    console.log("friend request recieved");

    createNotification(notificationInfo, [
        {
            label: "Accept",
            onClick: async () => {
                await acceptRequest(notificationInfo.senderID);
            },
        },
        {
            label: "Reject",
            onClick: async () => {
                await rejectRequest(notificationInfo.senderID);
            },
        },
    ]);
}

async function handleLobbyInviteNotification(notificationInfo) {
    createNotification(notificationInfo, [
        {
            label: "Join",
            onClick: async () => {
                // Logic to join the lobby
                console.log(`Joining lobby with ID: ${notificationInfo.lobbyID}`);
                joinLobby(notificationInfo.lobbyID)
            },
        },
        {
            label: "Decline",
            onClick: () => {
                console.log(`Declined lobby invite with ID: ${notificationInfo.lobbyID}`);
                // Add your decline logic here if needed
            },
        },
    ]);
}
