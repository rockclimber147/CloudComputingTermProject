import "dotenv/config";
import jwt from "jsonwebtoken";

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

    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
        throw new Error("Invalid token");
    }

    return decoded.userID;
}
