export interface CachingService {
  store(key: string, value: string, ttl: number): Promise<void>;

  get(key: string): Promise<string | null>;
  get(key: string, ttl: true): Promise<number | null>; // returns ttl or null if doesn't exist

  remove(key: string): Promise<void>;
}
