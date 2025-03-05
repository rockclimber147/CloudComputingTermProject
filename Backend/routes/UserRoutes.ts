import express, { Request, Response } from 'express';
import { userRepository } from "../config/RepositoryInit.js";


const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
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

router.get("/friends", async (req: Request, res: Response): Promise<void> => {
    try {
        const { userID } = req.body;
        const friends = await userRepository.getFriendsForUser(userID);
        res.status(200).json(friends);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

router.post('/send-friend-request', async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            res.status(400).json({ error: "senderId and receiverId are required." });
            return;
        }

        const userFriend = await userRepository.sendFriendRequest(senderId, receiverId);

        res.status(201).json({ message: "Friend request sent successfully!", userFriend });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

router.post('/accept-friend-request', async (req: Request, res: Response): Promise<void> => {
    try {
        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            res.status(400).json({ error: "senderId and receiverId are required." });
            return;
        }

        const userFriend = await userRepository.acceptFriendRequest(senderId, receiverId);

        res.status(201).json({ message: "Friend request sent successfully!", userFriend });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

export default router;