import url from "./url.js";

export async function logout() {
    console.log("Logging out...")
    const token = localStorage.getItem("token")
    const res = await fetch(`${url}/api/auth/logout`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
         },

    });
    console.log(res)
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("Logged out successfully, redirecting...")
    window.location.href = "index.html";
}

export async function fetchAuth(endpoint, method = "GET", body = null) {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("No authentication token found.");
    }

    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };

    if (body && method !== "GET") {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, options);

    if (!response.ok) {
        throw new Error(`error: ${response.error}`);
    }

    return response.json();
}