import { Redis } from 'ioredis';

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
    private _redisClient: Redis;

    get redisClient(): Redis {
      return this._redisClient;
    }
    
    set redisClient(client: Redis) {
      this._redisClient = client;
    }

  constructor(redisUrl: string) {
    this._redisClient = new Redis(redisUrl);

    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.redisClient.on('connect', () => {
      console.log('Connected to Redis successfully!');
    });

    this.redisClient.on('close', () => {
      console.log('Redis connection closed.');
    });

    this.redisClient.on('reconnecting', () => {
      console.log('Redis is reconnecting...');
    });
  }

  async connect(): Promise<void> {
    try {
      await this.redisClient.connect();
      console.log('Connected to Redis successfully!');
    } catch (error) {
      console.error('Error connecting to Redis:', error);
    }
  }

  // Set a key-value pair in Redis
  async setValue(key: string, value: string): Promise<void> {
    try {
      await this.redisClient.set(key, value);
    } catch (error) {
      console.error(`Error setting value for key ${key}:`, error);
    }
  }

  // Get a value by key from Redis
  async getValue(key: string): Promise<string | null> {
    try {
      return await this.redisClient.get(key);
    } catch (error) {
      console.error(`Error getting value for key ${key}:`, error);
      return null;
    }
  }

  // Disconnect from Redis server
  async disconnect(): Promise<void> {
    try {
      await this.redisClient.quit(); // ioredis quit method
      console.log('Disconnected from Redis');
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
    }
  }

  isConnected(): boolean {
    return this.redisClient.status === 'ready'; // 'ready' means connected and operational
  }
}

// Create an instance of RedisService
const redis: RedisService = new RedisService(process.env.REDIS_URL || 'redis://localhost:6379');

async function connectToRedis(): Promise<void> {
    if (!redis.isConnected()) {
      try {
        // Wait for Redis to be ready
        await new Promise<void>((resolve, reject) => {
          redis.redisClient.on('ready', resolve);
          redis.redisClient.on('error', reject);
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
export default redis;
