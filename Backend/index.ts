import "dotenv/config";
import express from "express";
import userRoutes from "./routes/UserRoutes.js";
import userNotificationRoutes from "./routes/UserNotificationRoutes.js";
import gameResultsRoutes from "./routes/GameResultsRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";
import startApp from "./config/AppStartup.js";
import { app, server } from "./config/Server.js";
import "./sockets/SocketHandler.js";
import path from "path";
import { authMiddleware } from "./routes/AuthRoutes.js";

const PORT = process.env.PORT || 3000;

const currentFileUrl = new URL(import.meta.url);
const backendDir = path
    .dirname(decodeURI(currentFileUrl.pathname))
    .replace(/^\/([A-Za-z]:)/, "$1");
console.log("Backend directory:", backendDir);

// Use path.join instead of path.resolve to avoid duplicate drive letters
const frontendDir = path.join(backendDir, "../Frontend");
const frontendScriptsDir = path.join(frontendDir, "scripts");
console.log("Frontend path:", frontendDir);

app.use("/scripts", express.static(frontendScriptsDir));
app.use(express.static(frontendDir));

app.get("/", async (req, res) => {
    console.log("start");
    const indexPath = path.join(frontendDir, "index.html");
    console.log("Resolved index.html path:", indexPath);

    // Ensure the path is correct
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.log("Error sending file:", err);
        }
    });
});


app.use("/api/auth", authRoutes);

// Jank to make authMiddleware global to all other api routes
app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api/auth')) {
        return next();
    }
    authMiddleware(req, res, next);
});

// Other route definitions
app.use("/api/users", userRoutes);
app.use("/api/notifications", userNotificationRoutes);
app.use("/api/GameResults", gameResultsRoutes);

startApp()
    .then(() => {
        server.listen(PORT, () => {
            console.log("Server is running on port", PORT);
        });
    })
    .catch((error) => {
        console.error("Error during application startup:", error);
        process.exit(1);
    });
