import "dotenv/config";
import jwt from "jsonwebtoken";
import redisService from "../config/RedisStartup.js";

interface TokenPayload {
    userID: number;
    iat: number;
    exp: number;
}

export const JWT_SECRET = process.env.JWT_SECRET;

export function createToken(userID: number): string {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign({ userID }, JWT_SECRET, { expiresIn: "1h" });
}

/**
 * Verifies the token and returns the userID
 * @param token the token to verify
 * @returns the userID of the token
 */
export function verifyToken(token: string): number {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    if (!decoded.userID) {
        throw new Error("Invalid token: Missing userID");
    }

    return decoded.userID;
}
