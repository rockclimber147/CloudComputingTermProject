import { io } from "../config/SocketServer.js";
import { LocalLobbyDatabase } from "./Databases.js";
import { userNotificationRepository } from "../config/RepositoryInit.js";

enum NotificationType {
    SentFriendRequest,
    ReceivedFriendRequest,
}

const db = new LocalLobbyDatabase();

export class Notification {
    //TODO: make this an enum and do an action in the frontend maybe have it send a function
    type: NotificationType;
    text: string;
    title: string;

    constructor(type: NotificationType, text: string, title: string) {
        this.type = type;
        this.text = text;
        this.title = title;
    }

    static async sendFriendRequestNotification(senderID: number, receiverID: number) {
        if (await db.isUserOnline(senderID)) {
            console.log("sending to online user", senderID);
            io.to(senderID.toString()).emit(
                "showNotification",
                new this(
                    NotificationType.SentFriendRequest,
                    `Your have sent a friend request to ${receiverID}`,
                    "Friend request success"
                )
            );
        } else {
            //TODO: save it in the database and show them later
        }

        if (await db.isUserOnline(receiverID)) {
            console.log("sending to online user", receiverID);
            io.to(receiverID.toString()).emit(
                "showNotification",
                new this(
                    NotificationType.ReceivedFriendRequest,
                    `Your have recieved a friend request from ${senderID}`,
                    "Recieved friend request"
                )
            );
        } else {
            //TODO: save it in the database and show them later
        }
    }
}
