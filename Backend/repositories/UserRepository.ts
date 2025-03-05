import { DbContext } from '../config/DbStartup.js'; 
import { UserFriendStatusEnum } from '../models/UserFriend.js';
import bcrypt from 'bcryptjs'

class UserRepository {
    SALT_ROUNDS = 10;
    MIN_PASSWORD_LENGTH = 6;

    private context: DbContext

    constructor(context: DbContext) {
        this.context = context
    }

    async getAllUsers() {
        return await this.context.User.findAll();
    }

    async createUser(username: string, email: string, password: string) {
        if (!password || password.length < this.MIN_PASSWORD_LENGTH) {
            throw new Error(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long`);
        }
        let hashedPassword: string = await bcrypt.hash(password, this.SALT_ROUNDS);
        return await this.context.User.create({ 
            username: username, 
            email: email, 
            password: hashedPassword
         });
    }

    async sendFriendRequest(senderId: number, receiverId: number) {
        return await this.context.UserFriend.create({ 
            senderID: senderId,
            receiverID: receiverId,
            status: UserFriendStatusEnum.Pending
        });
    }

    async acceptFriendRequest(senderId: number, receiverId: number) {
        const userFriend = await this.context.UserFriend.findOne({
            where: {
                senderID: senderId,
                receiverID: receiverId,
                status: UserFriendStatusEnum.Pending,
            }
        });
    
        if (!userFriend) {
            throw new Error('Friend request not found or already accepted/rejected.');
        }
        userFriend.status = UserFriendStatusEnum.Accepted;
        await userFriend.save();
        return userFriend;
    }

    async getFriendsForUser(userID: number) {
        const [fromUserFriends, toUserFriends] = await Promise.all([
            this.context.UserFriend.findAll({
                where: {
                    senderID: userID,
                    status: UserFriendStatusEnum.Accepted
                }
            }),
            this.context.UserFriend.findAll({
                where: {
                    receiverID: userID,
                    status: UserFriendStatusEnum.Accepted
                }
            })
        ]);

        return fromUserFriends
    .concat(toUserFriends)
    .sort((a, b) => {
        const aDate = a.dateAccepted ?? new Date(0);
        const bDate = b.dateAccepted ?? new Date(0);

        return aDate.getTime() - bDate.getTime(); // Compare as timestamps
    });
    }
}

export { UserRepository }