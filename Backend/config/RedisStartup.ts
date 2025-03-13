/*
Installing redis on Windows:

0. Launch powershell

1. Installed Windows Subsystem for Linux: wsl --install

2. Installed Ubuntu: wsl --install -d Ubuntu

3. Set up Ubuntu environment with username and password

3a. Updated package list: sudo apt update && sudo apt upgrade -y
3b. Installed redis: sudo apt install redis-server -y
3c. Started redis: sudo service redis-server start
3d. Verified redis is running: redis-cli ping
PONG

Running it again:

On Powershell: wsl
On Linux: sudo service redis-server start

*/

import { RedisService } from "../modules/redis/RedisService.js";

// Create an instance of RedisService
const redisService: RedisService = new RedisService(process.env.REDIS_URL || 'redis://localhost:6379');

async function connectToRedis(): Promise<void> {
    if (!redisService.isConnected()) {
      try {
        // Wait for Redis to be ready
        await new Promise<void>((resolve, reject) => {
          redisService.redisClient.on('ready', resolve);
          redisService.redisClient.on('error', reject);
        });
        console.log('Redis is ready to use');
      } catch (error) {
        console.error('Failed to connect to Redis:', error);
      }
    }
  }

export {
    connectToRedis
}
export default redisService;
