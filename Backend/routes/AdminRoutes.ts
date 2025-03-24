import express, { Request, Response, NextFunction } from "express";
import { AuthRequest } from './AuthRoutes.js';
import { adminRepository } from "../config/RepositoryInit.js";
import { handleError } from "../modules/ErrorHandling.js";

const router = express.Router();

router.post("/promote", async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;
        let message = await adminRepository.promoteUser(userId)
        res.status(200).json({ message: message });
    } catch (error: unknown) {
        handleError(res, error);
    }
});

export async function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    if (await adminRepository.userIsAdmin(req.userID!)) {
        console.log("User is admin")
        next();
    } else {
        return res.status(403).json({ error: "Unauthorized: Insufficient permissions" });
    }
}

export default router;