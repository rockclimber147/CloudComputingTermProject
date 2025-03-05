import { createClient, RedisClientType } from 'redis';
import "dotenv/config";

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

class RedisService {
  private redisClient: RedisClientType;

  constructor(redisUrl: string) {

    this.redisClient = createClient({ url: redisUrl });

    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
  }

  // Connect to Redis server
  async connect(): Promise<void> {
    await this.redisClient.connect();
    console.log('Connected to Redis successfully!');
  }

  // Set a key-value pair in Redis
  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async getValue(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async disconnect(): Promise<void> {
    await this.redisClient.quit();
    console.log('Disconnected from Redis');
  }
}

const redis: RedisService = new RedisService(process.env.REDIS_URL || 'redis://localhost:6379');

async function connectToRedis(): Promise<void> {
  try {
    await redis.connect();
  } catch (error: any) {
    console.error("Failed to connect to Redis: ", error);
  }
}

export {
    connectToRedis
}
export default redis;