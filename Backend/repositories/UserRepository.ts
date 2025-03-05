import { DbContext } from '../config/DbStartup.js'; 

interface UserLogic {

}

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
}

export { UserRepository }