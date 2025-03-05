import express from 'express';
import { userRepository } from "../config/RepositoryInit.js";

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const users = await userRepository.getAllUsers(); // Fetch all users
        res.status(200).json(users);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

export default router;