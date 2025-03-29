import { io } from "../config/SocketServer.js";

export function emitUpdateFriends(senderID: number, receiverID: number) {
    io.to(senderID.toString()).emit("updateFriends");
    io.to(receiverID.toString()).emit("updateFriends");
}
