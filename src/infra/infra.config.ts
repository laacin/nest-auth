import { RedisSingleOptions } from '@nestjs-modules/ioredis';
import { DynamicModule } from '@nestjs/common';
import { loadModels } from './mongo/schemas.mongo';

export interface InfraConfig {
  dependencies: DynamicModule[];
  mongo: MongoConfig;
  redis: RedisConfig;
}

interface MongoConfig {
  host: string;
  port: number;
  db: string;
  user?: string;
  password?: string;
}

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export const resolveCfg = (cfg: InfraConfig) => {
  const redisOpts: RedisSingleOptions = {
    type: 'single',
    options: {
      host: cfg.redis.host,
      port: cfg.redis.port,
      password: cfg.redis.password,
      db: cfg.redis.db,
    },
  };

  const mongoUri = (() => {
    const { host, port, user, password, db } = cfg.mongo;
    const auth = user && password ? `${user}:${password}@` : '';
    return `mongodb://${auth}${host}:${port}/${db}`;
  })();

  const mongoModels = loadModels();

  return { redisOpts, mongoUri, mongoModels };
};
