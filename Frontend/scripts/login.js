import { refreshLogin } from "./refreshLogin.js";
import url from "./url.js";

document.addEventListener("DOMContentLoaded", async () => {
    const loggedIn = await refreshLogin();
    if (loggedIn) {
        window.location.href = "home.html";
    }
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

    const username = document.querySelector("input[name='username']").value;
    const password = document.querySelector("input[name='password']").value;

    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), 
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.error || "Login failed");
      }

            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data.user)); // Store user data
            localStorage.setItem("token", data.token); // Store token
            window.location.href = "home.html"; // Redirect to home page
        } catch (error) {
            console.error("Login error:", error);
            alert(
                error.message || "Login failed. Check your credentials and try again."
            );
        }
    });
});
