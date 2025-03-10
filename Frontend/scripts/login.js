document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.querySelector("input[name='username']").value; // Ensure the input name is "username"
        const password = document.querySelector("input[name='password']").value;

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST", // Use POST for login
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }), // Send username and password
            });

            if (!response.ok) {
                const errorData = await response.json(); // Parse the error response
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
