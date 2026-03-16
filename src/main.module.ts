import { DynamicModule, Module } from '@nestjs/common';
import { AppModule } from '@app/app.module';
import { InfraModule } from '@infra/infra.module';
import { AdapterModule } from '@adapter/adapter.module';

@Module({})
export class MainModule {
  static forRoot(): DynamicModule {
    const infraModule = InfraModule.forRoot({
      dependencies: [],
      mongo: {
        host: 'localhost',
        port: 27017,
        db: 'authdb',
      },
      redis: {
        host: 'localhost',
        port: 6379,
        password: 'password',
        db: 0,
      },
    });

    const appModule = AppModule.forRoot({
      dependencies: [infraModule],
      key: { algorithm: 'HMAC', secretKey: 'secretKey' },
      appName: 'MyApp',
    });

    const adapterModule = AdapterModule.forRoot({
      dependencies: [appModule],
    });

    return {
      imports: [infraModule, appModule, adapterModule],
      module: MainModule,
    };
  }
}
