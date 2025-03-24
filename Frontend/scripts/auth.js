import url from "./url.js";

export class adminRolesEnum {
    static ADMIN = 1
}

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

export async function fetchAdmin(endpoint, method = "GET", body = null) {
    try {
        let res = await fetchAuth(endpoint, method, body)
        if (res.status === 403) {
            window.location.href = "home.html";
        }
        return res
    } catch (error) {
        console.error("Error verifying admin status:", error);
        window.location.href = "home.html";
    }
}