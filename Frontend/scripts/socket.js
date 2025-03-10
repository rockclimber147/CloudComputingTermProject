import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const socket = io("http://localhost:3000");

const token = localStorage.getItem("token");
// const token = "123";

if (!token) {
    alert("You need to login first");
    window.location.href = "index.html";
}

socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("login", token);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

export default socket;
