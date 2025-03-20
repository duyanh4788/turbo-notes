import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { CONNECT_REDIS } from 'packages/common/constant';
import { config } from 'packages/config';
import { Helper } from 'packages/utils/helper';

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis(config.REDIS.URL, {
      retryStrategy(times) {
        const delay = Math.min(times * 50, config.NUMBER_DELAY);
        Logger.log(`Retrying to connect to Redis... Attempt #${times}, delay: ${delay}ms`);
        return delay;
      },
    });

    this.redisClient.on('connect', () => {
      Logger.log('Connected to Redis');
    });

    this.redisClient.on('error', (err) => {
      Logger.error(`Redis error: ${err.message}`);
    });
  }

  async connect(): Promise<void> {
    if (CONNECT_REDIS.includes(this.redisClient.status)) {
      Logger.log('Redis is already connected');
      return;
    }

    try {
      await this.redisClient.connect();
      Logger.log('Connected to Redis server');
    } catch (error) {
      Logger.error(`Failed to connect to Redis: ${(error as Error).message}`);
    }
  }

  async _getString<T>(key: string): Promise<T> {
    const result = await this.redisClient.get(key);
    if (!result) return null;
    return Helper.parseJson(result);
  }

  async _setString<T>(key: string, data: T, ttl?: number): Promise<void> {
    const stringData = JSON.stringify(data);
    if (ttl && ttl > 0) {
      await this.redisClient.set(key, stringData, 'EX', ttl);
    } else {
      await this.redisClient.set(key, stringData);
    }
  }

  async _getHash<T>(key: string): Promise<T> {
    const result = await this.redisClient.get(key);
    if (!result) return null;
    return Helper.parseJson(result);
  }

  async _setHash<T>(key: string, data: T, ttl?: number): Promise<void> {
    const stringData = JSON.stringify(data);
    if (ttl && ttl > 0) {
      await this.redisClient.set(key, stringData, 'EX', ttl);
    } else {
      await this.redisClient.set(key, stringData);
    }
  }

  async _del(key: string): Promise<void> {
    await this.redisClient.get(key);
  }

  async _setNx(key: string): Promise<number> {
    return await this.redisClient.setnx(key, 'true');
  }
}
