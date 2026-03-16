import { CACHING_SERVICE } from '@domain/tokens';
import { Inject, Injectable } from '@nestjs/common';

// constants (prefix)
const TOKEN = 'token';
const OTP = 'otp';

// abstraction
export interface ICachingService {
  store(key: string, ttlMS: number): Promise<void>;
  get(key: string): Promise<number | null>; // returns ttl or null if doesn't exist
  remove(key: string): Promise<void>;
}

@Injectable()
export class CachingService {
  constructor(
    @Inject(CACHING_SERVICE) private readonly cache: ICachingService,
  ) {}

  async revokeToken(token: string, ttlMS: number) {
    const key = prefix(TOKEN, token);
    await this.cache.store(key, ttlMS);
  }

  async isRevoked(token: string) {
    const key = prefix(TOKEN, token);
    const result = await this.cache.get(key);
    return result !== null;
  }

  async setOtpPending(userId: string, ttlMS: number) {
    const key = prefix(OTP, userId);
    await this.cache.store(key, ttlMS);
  }

  async isOtpPending(userId: string) {
    const key = prefix(OTP, userId);
    const ttl = await this.cache.get(key);
    return ttl !== null && ttl > 0;
  }

  async setOtpDone(userId: string) {
    const key = prefix(OTP, userId);
    await this.cache.remove(key);
  }
}

// helpers
const prefix = (prefix: string, key: string) => `${prefix}:${key}`;
