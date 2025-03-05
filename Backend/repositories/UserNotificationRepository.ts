import { DbContext } from '../config/DbStartup.js'; 
import { ErrorWithStatusCode } from '../modules/ErrorHandling.js';

class UserNotificationRepository {
    private context: DbContext

    constructor(context: DbContext) {
        this.context = context
    }
};

export { UserNotificationRepository }