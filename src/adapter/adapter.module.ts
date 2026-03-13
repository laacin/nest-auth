import { DynamicModule, Module } from '@nestjs/common';
import { AdapterConfig } from './adapter.config';
import { AuthController } from './controllers/auth.controller';

@Module({})
export class AdapterModule {
  static forRoot(cfg: AdapterConfig): DynamicModule {
    return {
      imports: [...cfg.dependencies],
      module: AdapterModule,
      controllers: [AuthController],
    };
  }
}
