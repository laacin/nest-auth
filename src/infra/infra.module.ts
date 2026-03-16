import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfraConfig, resolveCfg } from './infra.config';
import { CACHING_SERVICE, USER_REPO } from '@domain/tokens';
import { UserRepoImpl } from './mongo/user.repo.impl';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CachingServiceImpl } from './redis/caching.service.impl';

@Module({})
export class InfraModule {
  static forRoot(cfg: InfraConfig): DynamicModule {
    const { mongoUri, mongoModels, redisOpts } = resolveCfg(cfg);

    const mongooseFeatures = MongooseModule.forFeature(mongoModels);
    const mongooseModule = MongooseModule.forRoot(mongoUri, {
      socketTimeoutMS: 2000,
    });

    const redisModule = RedisModule.forRoot(redisOpts);

    return {
      imports: [
        mongooseModule,
        mongooseFeatures,
        redisModule,
        ...cfg.dependencies,
      ],
      module: InfraModule,
      providers: [
        { provide: USER_REPO, useClass: UserRepoImpl },
        { provide: CACHING_SERVICE, useClass: CachingServiceImpl },
      ],
      exports: [USER_REPO, CACHING_SERVICE],
    };
  }
}
