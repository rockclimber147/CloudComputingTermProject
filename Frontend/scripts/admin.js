import { fetchAdmin, adminRolesEnum } from "./auth.js";
import url from "./url.js";

document.addEventListener("DOMContentLoaded", async () => {
    await updateDisplays()
});

async function updateDisplays() {
    const res = await fetchAdmin(`${url}/api/admin/users`)
    const users = res.users
    console.log(users)
    let adminUsers = []
    let regularUsers = []

    for (let user of users){
        if (user.roles.find(role => role == adminRolesEnum.ADMIN))
            adminUsers.push(user)
        else
            regularUsers.push(user)
    };
    createAdminUserCards(adminUsers)
    createRegularUserCards(regularUsers)
    console.log(regularUsers)
    console.log(adminUsers)
}

function createAdminUserCards(users) {
    const userListContainer = document.getElementById('admin-list-container');
    userListContainer.innerHTML = ''; // Clear the container before adding new cards

    // Loop through each user and create their card
    users.forEach(user => {
        // Create the card container
        const [userCard, userContent] = createUserCard(user)
        userCard.appendChild(userContent);
        userListContainer.appendChild(userCard);
    });
}

function createRegularUserCards(users) {
    const userListContainer = document.getElementById('user-list-container');
    userListContainer.innerHTML = ''; // Clear the container before adding new cards

    // Loop through each user and create their card
    users.forEach(user => {
        // Create the card container
        const [userCard, userContent] = createUserCard(user, )

        // Create the buttons (Promote and Delete)
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('btn-group', 'btn-group-sm');

        // Promote Button
        const promoteButton = document.createElement('button');
        promoteButton.classList.add('btn', 'btn-warning');
        promoteButton.textContent = 'Promote';
        promoteButton.onclick = () => promoteUser(user.id); // Replace with your actual promote function

        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteUser(user.id); // Replace with your actual delete function

        // Append buttons to the button container
        buttonContainer.appendChild(promoteButton);
        buttonContainer.appendChild(deleteButton);

        // Append content and buttons to the user card
        userCard.appendChild(userContent);
        userCard.appendChild(buttonContainer);

        // Append the user card to the container
        userListContainer.appendChild(userCard);
    });
}

function createUserCard(user) {
    const userCard = document.createElement('div');
    userCard.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    // Create the content of the card
    const userContent = document.createElement('div');
    userContent.innerHTML = `
        <h5 class="mb-1">${user.username}</h5>
        <p class="mb-1">${user.email}</p>
        <small>User ID: ${user.id}</small>
    `;
    return [userCard, userContent]
}

async function promoteUser(userId) {
    alert(`Promoting user with ID: ${userId}`);
    await fetchAdmin(`${url}/api/admin/promote`, 'POST', { userId: userId })
    updateDisplays()
}

async function deleteUser(userId) {
    const confirmDelete = window.confirm(`Are you sure you want to delete the user with ID: ${userId}?`);

    if (confirmDelete) {
        try {
            alert(`Deleting user with ID: ${userId}`);
            await fetchAdmin(`${url}/api/admin/delete`, 'POST', { userId: userId });
            updateDisplays();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("There was an error while deleting the user.");
        }
    } else {
        console.log(`User deletion canceled for ID: ${userId}`);
    }
}
