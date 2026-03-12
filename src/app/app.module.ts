import { DynamicModule, Module } from '@nestjs/common';
import { AuthUseCase } from './use-cases/auth.use-case';
import { AppConfig } from './app.config';
import { JwtModule } from '@nestjs/jwt';
import { createPublicKey } from 'crypto';
import { TokenService } from './services/token.service';

@Module({})
export class AppModule {
  static forRoot(cfg: AppConfig): DynamicModule {
    const { privateKey } = cfg;
    const publicKey = createPublicKey(privateKey).export({
      type: 'spki',
      format: 'pem',
    });

    const jwtModule = JwtModule.register({
      privateKey,
      publicKey,
      signOptions: { algorithm: 'RS256' },
    });

    return {
      imports: [jwtModule, ...cfg.dependencies],
      module: AppModule,
      providers: [TokenService, AuthUseCase],
      exports: [AuthUseCase],
    };
  }
}
