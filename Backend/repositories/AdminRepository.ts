import { DbContext } from '../config/DbStartup.js'; 
import { RoleIdEnum } from '../models/Role.js';

class AdminRepository {

    private context: DbContext

    constructor(context: DbContext) {
        this.context = context
    }

    async userIsAdmin(userID: number): Promise<boolean> {
        const userRole = await this.context.UserRole.findOne({where: {
            userId: userID,
            roleId: RoleIdEnum.ADMIN
        }})
        return !!userRole;
    }

    async promoteUser(userID: number): Promise<string> {
        let message: string
        if (await this.userIsAdmin(userID)) {
            message = "User is already admin"
        } else {
            await this.context.UserRole.create({
                userId: userID,
                roleId: RoleIdEnum.ADMIN
            });
            message = "User promoted successfully!"
        }

        return message;
    }
}

export { AdminRepository }