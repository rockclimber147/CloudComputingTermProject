import { context } from '../config/DbStartup.js'; 
import { UserRepository } from '../repositories/UserRepository.js';
import { UserNotificationRepository } from '../repositories/UserNotificationRepository.js';
import { GameResultsRepository } from '../repositories/GameResultsRepository.js';

const userRepository: UserRepository = new UserRepository(context);
const userNotificationRepository = new UserNotificationRepository(context);
const gameResultsRepository = new GameResultsRepository(context)

export {
    userRepository,
    userNotificationRepository,
    gameResultsRepository
}