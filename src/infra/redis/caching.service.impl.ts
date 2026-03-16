import { ICachingService } from '@app/services/caching.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

export class CachingServiceImpl implements ICachingService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async store(key: string, ttl: number): Promise<void> {
    await this.redis.set(key, 1, 'EX', ttl);
  }

  async get(key: string): Promise<number | null> {
    const result = await this.redis.ttl(key);
    if (result === -2) return null;
    return result;
  }

  async remove(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
