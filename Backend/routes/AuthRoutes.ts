import express, { Request, Response, NextFunction } from "express";
import { userRepository } from "../config/RepositoryInit.js";
import { handleError } from "../modules/ErrorHandling.js";
import { blacklistToken, createToken, verifyToken } from "../modules/JwtUtils.js";

const router = express.Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body; // Ensure the fields match the frontend

        // Log the request body for debugging
        console.log("Login request body:", req.body);

        // Call the repository function to authenticate the user
        const user = await userRepository.loginUser(username, password);
        // create a token for the user
        const token = createToken(user.id);
        res.status(200).json({ user, token });
    } catch (error: unknown) {
        handleError(res, error);
    }
});

router.post("/create", async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;
        const user = await userRepository.createUser(username, email, password);
        const token = createToken(user.id);
        res.status(200).json({ user, token });
    } catch (error: unknown) {
        handleError(res, error);
    }
});

router.post("/logout", async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) await blacklistToken(token)
        res.status(200).json("User logged out successfully");
    } catch (error: unknown) {
        handleError(res, error);
    }
});

router.post("/verify", async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new Error("No token provided");
        }

        const userID = await verifyToken(token);
        const user = await userRepository.getUser(userID);
        const newToken = createToken(user.id);
        res.status(200).json({ user, token: newToken });
    } catch (error: unknown) {
        handleError(res, error);
    }
});

export interface AuthRequest extends Request {
    userID?: number;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await verifyToken(token)
        req.userID = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Unauthorized: Invalid token" });
    }
}

export default router;
