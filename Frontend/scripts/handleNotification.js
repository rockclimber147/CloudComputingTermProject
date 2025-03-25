import socket from "./socket.js";

const NotificationType = {
    0: handleSendFriendRequestNotification,
    1: handleReceivedFriendRequestNotification,
};

socket.on("showNotification", (notificationInfo) => {
    showNotification(notificationInfo);
});

// notification should have a title, userWhoSendIt, message, action
function showNotification(notificationInfo) {
    NotificationType[notificationInfo.type](notificationInfo);

    // console.log(notificationInfo);
}

function handleSendFriendRequestNotification(notificationInfo) {
    console.log("friend request sent");
    console.log(notificationInfo);
    // it should just say that it succeeeded

    const notificationElement = document.createElement("div");
    notificationElement.className = "notification";
    notificationElement.style.position = "fixed";
    notificationElement.style.bottom = "10px";
    notificationElement.style.right = "10px";
    notificationElement.style.backgroundColor = "#f8f9fa";
    notificationElement.style.border = "1px solid #ddd";
    notificationElement.style.padding = "10px";
    notificationElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
    notificationElement.innerHTML = `
        <h4>${notificationInfo.title}</h4>
        <p>${notificationInfo.text}</p>
    `;
    document.body.appendChild(notificationElement);

    setTimeout(() => {
        notificationElement.style.display = "none";
    }, 3000);
}

function handleReceivedFriendRequestNotification(notificationInfo) {
    console.log("friend request recieved");
    console.log(notificationInfo);
    // there should be an accept notification button

    const notificationElement = document.createElement("div");
    notificationElement.className = "notification";
    notificationElement.style.position = "fixed";
    notificationElement.style.bottom = "10px";
    notificationElement.style.right = "10px";
    notificationElement.style.backgroundColor = "#f8f9fa";
    notificationElement.style.border = "1px solid #ddd";
    notificationElement.style.padding = "10px";
    notificationElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
    notificationElement.innerHTML = `
        <h4>${notificationInfo.title}</h4>
        <p>${notificationInfo.text}</p>
        <button id="acceptButton">Accept</button>
        <button id="rejectButton">Reject</button>
    `;
    document.body.appendChild(notificationElement);
    document.getElementById("acceptButton").addEventListener("click", () => {
        document.body.removeChild(notificationElement);
    });

    document.getElementById("rejectButton").addEventListener("click", () => {
        document.body.removeChild(notificationElement);
    });

    setTimeout(() => {
        if (document.body.contains(notificationElement)) {
            document.body.removeChild(notificationElement);
        }
    }, 3000);
}
