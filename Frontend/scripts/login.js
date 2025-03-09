document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.querySelector("input[type='email']").value;
        const password = document.querySelector("input[type='password']").value;

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }) // GET requests shouldn't have a body, consider changing API to POST
            });

            if (!response.ok) throw new Error("Login failed");

            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data)); // Store user data
            window.location.href = "home.html"; // Redirect to home page
        } catch (error) {
            alert("Login failed. Check your credentials and try again.");
        }
    });
});
