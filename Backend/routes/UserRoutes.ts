import express, { Request, Response } from 'express';
import { userRepository } from "../config/RepositoryInit.js";
import { handleError } from '../modules/ErrorHandling.js';
import { AuthRequest } from './AuthRoutes.js';


const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userRepository.getAllUsers(); // Fetch all users
        res.status(200).json(users);
    } catch (error: unknown) {
        handleError(res, error)
    }
});


router.get("/friends", async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userID  = req.userID!;
        const friends = await userRepository.getFriendsForUser(userID);
        res.status(200).json(friends);
    } catch (error: unknown) {
        handleError(res, error)
    }
});

router.post('/send-friend-request', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { receiverId } = req.body;
        const senderId = req.userID!;

        if (!senderId || !receiverId) {
            res.status(400).json({ error: "senderId and receiverId are required." });
            return;
        }

        const userFriend = await userRepository.sendFriendRequest(senderId, receiverId);

        res.status(201).json({ message: "Friend request sent successfully!", userFriend });
    } catch (error: unknown) {
        handleError(res, error)
    }
});

router.post('/accept-friend-request', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { senderID } = req.body;
        const receiverID = req.userID!;
        if (!senderID || !receiverID) {
            res.status(400).json({ error: "senderId and receiverId are required." });
            return;
        }

        const userFriend = await userRepository.acceptFriendRequest(senderID, receiverID);

        res.status(201).json({ message: "Friend request sent successfully!", userFriend });
    } catch (error: unknown) {
        handleError(res, error)
    }
});

router.post('/reject-friend-request', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { senderID } = req.body;
        const receiverID = req.userID!;
        if (!senderID || !receiverID) {
            res.status(400).json({ error: "senderId and receiverId are required." });
            return;
        }

        const userFriend = await userRepository.rejectFriendRequest(senderID, receiverID);

        res.status(201).json({ message: "Friend request rejected successfully!", userFriend });
    } catch (error: unknown) {
        handleError(res, error)
    }
});

export default router;