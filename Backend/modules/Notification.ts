import { io } from "../config/SocketServer.js";
import { LocalLobbyDatabase } from "./Databases.js";
import {
    userNotificationRepository,
    userRepository,
} from "../config/RepositoryInit.js";

enum NotificationType {
    SentFriendRequest,
    ReceivedFriendRequest,
    AcceptedFriendRequest,
    RejectedFriendRequest,
    LobbyInvite,
}

const db = new LocalLobbyDatabase();

export class Notification {
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
            const recieverName = (await userRepository.getUser(receiverID)).username;
            io.to(senderID.toString()).emit(
                "showNotification",
                new SentFriendRequestNotification(
                    `You have sent a friend request to ${recieverName}`,
                    "Friend request success",
                    receiverID
                )
            );
        } else {
            //TODO: save it in the database and show them later
        }

        if (await db.isUserOnline(receiverID)) {
            const senderName = (await userRepository.getUser(senderID)).username;
            io.to(receiverID.toString()).emit(
                "showNotification",
                new RecievedFriendRequestNotification(
                    `Your have recieved a friend request from ${senderName}`,
                    "Recieved friend request",
                    senderID
                )
            );
        } else {
            //TODO: save it in the database and show them later
        }
    }

    static async sendAcceptedFriendRequestNotification(
        senderID: number,
        receiverID: number
    ) {
        if (await db.isUserOnline(senderID)) {
            const recieverName = (await userRepository.getUser(receiverID)).username;
            io.to(senderID.toString()).emit(
                "showNotification",
                new AcceptedFriendRequestNotification(
                    `Your Friend Request to ${recieverName} has been accepted`,
                    "Accepted friend request"
                )
            );
        } else {
            //TODO: save it in the database and show them later
        }
    }

    static async sendRejectedFriendRequestNotification(
        senderID: number,
        receiverID: number
    ) {
        if (await db.isUserOnline(senderID)) {
            const recieverName = (await userRepository.getUser(receiverID)).username;
            io.to(senderID.toString()).emit(
                "showNotification",
                new RejectedFriendRequestNotification(
                    `Your Friend Request to ${recieverName} has been rejected`,
                    "Rejected friend request"
                )
            );
        } else {
            //TODO: save it in the database and show them later
        }
    }

    static async sendLobbyInvite(
        senderID: number,
        recieverID: number,
        lobbyID: string
    ) {
        if (await db.isUserOnline(recieverID)) {
            const senderName = (await userRepository.getUser(senderID)).username;
            io.to(recieverID.toString()).emit(
                "showNotification",
                new LobbyInviteNotification(
                    lobbyID,
                    `You have recieved a invite to join ${senderName}'s lobby`,
                    "Lobby invite"
                )
            );
        }
    }
}

class SentFriendRequestNotification extends Notification {
    recieverID: number;

    constructor(text: string, title: string, recieverID: number) {
        super(NotificationType.SentFriendRequest, text, title);
        this.recieverID = recieverID;
    }
}

class RecievedFriendRequestNotification extends Notification {
    senderID: number;

    constructor(text: string, title: string, senderID: number) {
        super(NotificationType.ReceivedFriendRequest, text, title);
        this.senderID = senderID;
    }
}

class AcceptedFriendRequestNotification extends Notification {
    constructor(text: string, title: string) {
        super(NotificationType.AcceptedFriendRequest, text, title);
    }
}

class RejectedFriendRequestNotification extends Notification {
    constructor(text: string, title: string) {
        super(NotificationType.AcceptedFriendRequest, text, title);
    }
}

class LobbyInviteNotification extends Notification {
    lobbyID: string;
    constructor(lobbyID: string, text: string, title: string) {
        super(NotificationType.LobbyInvite, text, title);
        this.lobbyID = lobbyID;
    }
}
