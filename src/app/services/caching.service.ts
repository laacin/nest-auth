import { CACHING_SERVICE } from '@domain/tokens';
import { Inject, Injectable } from '@nestjs/common';

// constants (prefix)
// const TOKEN = 'token';
// const OTP = 'otp';
//
// // abstraction
// export interface ICachingService {
//   store(key: string, value: string, ttl: number): Promise<void>;
//
//   get(key: string): Promise<string | null>;
//   get(key: string, ttl: true): Promise<number | null>; // returns ttl or null if doesn't exist
//
//   remove(key: string): Promise<void>;
// }

// @Injectable()
// export class CachingService {
//   constructor(
//     @Inject(CACHING_SERVICE) private readonly cache: ICachingService,
//   ) {}
//
//   // for token
//   async revokeToken(token: string, ttl: number) {
//     const key = prefix(TOKEN, token);
//     await this.cache.store(key, '1', ttl);
//   }
//
//   async isRevoked(token: string) {
//     const key = prefix(TOKEN, token);
//     const result = await this.cache.get(key, true);
//     return result !== null;
//   }
//
//   // otp auth
//   async setOtpPending(userId: string, ttl: number) {
//     const key = prefix(OTP, userId);
//     await this.cache.store(key, '1', ttl);
//   }
//
//   async isOtpPending(userId: string) {
//     const key = prefix(OTP, userId);
//     const ttl = await this.cache.get(key, true);
//     return ttl !== null && ttl > 0;
//   }
//
//   async setOtpDone(userId: string) {
//     const key = prefix(OTP, userId);
//     await this.cache.remove(key);
//   }
// }
//
// // helpers
// const prefix = (prefix: string, key: string) => `${prefix}:${key}`;
