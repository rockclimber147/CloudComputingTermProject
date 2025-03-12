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