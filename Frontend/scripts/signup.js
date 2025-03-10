import url from "./url.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const username = document.querySelector("input[name='username']").value;
        const email = document.querySelector("input[name='email']").value;
        const password = document.querySelector("input[name='password']").value;

        try {
            const response = await fetch(`${url}/api/auth/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                const data = await response.json(); 
                throw new Error(data.error || "Signup failed");
            }

            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data));
            window.location.href = "home.html";
        } catch (error) {
            console.error("Signup error:", error);
            alert(error.message || "Signup failed. Try again.");
        }
    });
});