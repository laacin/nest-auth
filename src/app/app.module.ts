import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AuthUseCase } from './use-cases/auth.use-case';
import { AppConfig, resolveKey } from './app.config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { TwoFactorService } from './services/2fa.service';
import { APP_NAME } from '@domain/tokens';

@Module({})
export class AppModule {
  static forRoot(cfg: AppConfig): DynamicModule {
    const jwtConfig = resolveKey(cfg.key);
    const jwtModule = JwtModule.register(jwtConfig);

    const AppName = {
      provide: APP_NAME,
      useValue: cfg.appName,
    } satisfies Provider;

    return {
      imports: [jwtModule, ...cfg.dependencies],
      module: AppModule,
      providers: [TokenService, TwoFactorService, AuthUseCase, AppName],
      exports: [AuthUseCase],
    };
  }
}
