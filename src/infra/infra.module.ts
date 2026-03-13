import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfraConfig } from './infra.config';
import { USER_REPO } from '@domain/tokens';
import { UserRepoImpl } from './mongo/user.repo.impl';
import { loadModels } from './mongo/schemas.mongo';

@Module({})
export class InfraModule {
  static forRoot(cfg: InfraConfig): DynamicModule {
    const mongooseFeatures = MongooseModule.forFeature(loadModels());
    const mongooseModule = MongooseModule.forRoot(cfg.mongoUri, {
      socketTimeoutMS: 2000,
    });

    return {
      imports: [mongooseModule, mongooseFeatures, ...cfg.dependencies],
      module: InfraModule,
      providers: [{ provide: USER_REPO, useClass: UserRepoImpl }],
      exports: [USER_REPO],
    };
  }
}
