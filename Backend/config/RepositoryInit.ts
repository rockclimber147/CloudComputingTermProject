import { context } from '../config/DbStartup.js'; 
import { UserRepository } from '../repositories/UserRepository.js';
import { UserNotificationRepository } from '../repositories/UserNotificationRepository.js';
import { GameResultsRepository } from '../repositories/GameResultsRepository.js';
import { AdminRepository } from '../repositories/AdminRepository.js';

const userRepository: UserRepository = new UserRepository(context);
const userNotificationRepository = new UserNotificationRepository(context);
const gameResultsRepository = new GameResultsRepository(context)
const adminRepository = new AdminRepository(context)

export {
    userRepository,
    userNotificationRepository,
    gameResultsRepository,
    adminRepository
}