export async function refreshLogin(){
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
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
        localStorage.removeItem("user");
        return false;
    }

    const data = await result.json();
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    return true;
}

refreshLogin();
