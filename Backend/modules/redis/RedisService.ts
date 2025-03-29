import { Redis } from 'ioredis';

export class RedisService {
    private _redisClient: Redis;

    get redisClient(): Redis {
      return this._redisClient;
    }
    
    set redisClient(client: Redis) {
      this._redisClient = client;
    }

  constructor(redisUrl: string) {
    this._redisClient = new Redis(redisUrl, {
      tls: {}
    });

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

  async blacklistToken(token: string, expiry: number) {
    await this._redisClient.setex(`blacklist:${token}`, expiry, "true");
  }

  async tokenIsBlacklisted(token: string): Promise<boolean> {
    const result = await this._redisClient.get(`blacklist:${token}`);
    return result !== null;
  }
}