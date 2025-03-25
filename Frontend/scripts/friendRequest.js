export async function acceptRequest(userId) {
    try {
        console.log(userId)
        await fetchAuth(`${url}/api/users/accept-friend-request`, "POST", { senderID: userId });
        alert("Friend request accepted!");
        refreshDropdowns(); // Refresh the dropdowns to update the status
    } catch (error) {
        console.error("Error accepting friend request:", error);
    }
}


export async function rejectRequest(userId) {
    try {
        await fetchAuth(`${url}/api/users/reject-friend-request`, "POST", { senderID: userId });
        alert("Friend request declined!");
        refreshDropdowns(); // Refresh the dropdowns to update the status
    } catch (error) {
        console.error("Error declining friend request:", error);
    }
}