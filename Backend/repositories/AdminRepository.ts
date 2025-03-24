import { DbContext } from '../config/DbStartup.js'; 
import { RoleIdEnum } from '../models/Role.js';
import { UserWithRoles } from '../models/User.js';


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

    async deleteUser(userID: number): Promise<string> {
        let message: string;
    
        const result = await this.context.User.destroy({
            where: { id: userID }
        });
    
        if (result === 0) {
            message = `User with ID ${userID} not found.`;
        } else {
            message = `User with ID ${userID} successfully deleted.`;
        }
    
        return message;
    }

    async getUsersWithRoles() {
        const [users, roles] = await Promise.all([
            this.context.User.findAll(),
            this.context.UserRole.findAll()
        ]);

        const userMap: Map<number, UserWithRoles> = new Map
        users.forEach(user => userMap.set(user.id, new UserWithRoles(user, [])))
        roles.forEach(role => userMap.get(role.userId)?.roles.push(role.roleId))
        const result: UserWithRoles[] = Array.from(userMap.values());
        return result;
    }
}

export { AdminRepository }