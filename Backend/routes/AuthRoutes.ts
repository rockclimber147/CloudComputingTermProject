import express, { Request, Response } from 'express';
import { userRepository } from "../config/RepositoryInit.js";
import { handleError } from '../modules/ErrorHandling.js';


const router = express.Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body; // Ensure the fields match the frontend

        // Log the request body for debugging
        console.log("Login request body:", req.body);

        // Call the repository function to authenticate the user
        const user = await userRepository.loginUser(username, password);
        res.status(200).json(user);
    } catch (error: unknown) {
        handleError(res, error);
    }
});

router.post("/create", async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;
        const user = await userRepository.createUser(username, email, password);
        res.status(200).json(user);
    } catch (error: unknown) {
        handleError(res, error)
    }
});

export default router;