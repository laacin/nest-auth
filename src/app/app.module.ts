import { DynamicModule, Module } from '@nestjs/common';
import { AuthUseCase } from './use-cases/auth.use-case';
import { AppConfig, resolveKey } from './app.config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';

@Module({})
export class AppModule {
  static forRoot(cfg: AppConfig): DynamicModule {
    const jwtConfig = resolveKey(cfg.key);
    const jwtModule = JwtModule.register(jwtConfig);

    return {
      imports: [jwtModule, ...cfg.dependencies],
      module: AppModule,
      providers: [TokenService, AuthUseCase],
      exports: [AuthUseCase],
    };
  }
}
