import express, { Request, Response } from "express";
import { userRepository } from "../config/RepositoryInit.js";
import { handleError } from "../modules/ErrorHandling.js";
import { createToken, verifyToken } from "../modules/JwtUtils.js";

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
        const { userID } = req.body;
        const user = await userRepository.logoutUser(userID);
        res.status(200).json(user);
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

        const userID = verifyToken(token);
        const user = await userRepository.getUser(userID);
        const newToken = createToken(user.id);
        res.status(200).json({ user, token: newToken });
    } catch (error: unknown) {
        handleError(res, error);
    }
});

export default router;
