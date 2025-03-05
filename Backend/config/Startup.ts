import { connectToSQLDB } from './DbStartup.js';
import { connectToRedis } from './RedisStartup.js';



async function startApp(): Promise<void> {
  try {
    await connectToSQLDB()
    await connectToRedis()
    console.log('All services are connected, starting the application...');

  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}

export default startApp
