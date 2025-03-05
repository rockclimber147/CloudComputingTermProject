import { context } from '../config/DbStartup.js'; 
import { UserRepository } from '../repositories/UserRepository.js';

const userRepository: UserRepository = new UserRepository(context);

export {
    userRepository
}