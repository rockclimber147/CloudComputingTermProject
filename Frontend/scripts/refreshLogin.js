async function refreshLogin() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to login first");
        window.location.href = "index.html";
    }

    const result = await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!result.ok) {
        localStorage.removeItem("token");
        alert("You need to login first");
        window.location.href = "login.html";
    }

    const data = await result.json();
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
}

refreshLogin();
