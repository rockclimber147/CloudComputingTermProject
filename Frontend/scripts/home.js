import { refreshLogin } from "./refreshLogin.js";
document.addEventListener("DOMContentLoaded", async () => {
    const isLoggedIn = await refreshLogin();
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
});
