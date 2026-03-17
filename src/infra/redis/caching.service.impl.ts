import { CachingService } from '@domain/services/caching.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

export class CachingServiceImpl implements CachingService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async store(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttl);
  }

  async get(key: string): Promise<string | null>;
  async get(key: string, ttl: true): Promise<number | null>;
  async get(key: string, ttl?: boolean): Promise<number | string | null> {
    if (ttl) {
      const result = await this.redis.ttl(key);
      return result === -2 ? null : result;
    }

    return await this.redis.get(key);
  }

  async remove(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
