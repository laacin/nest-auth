import { DynamicModule, Module } from '@nestjs/common';
import { AppModule } from '@app/app.module';
import { InfraModule } from '@infra/infra.module';
import { AdapterModule } from '@adapter/adapter.module';

@Module({})
export class MainModule {
  static forRoot(): DynamicModule {
    const infraModule = InfraModule.forRoot({
      dependencies: [],
      mongoUri: 'mongodb://localhost:27017/authdb',
    });

    const appModule = AppModule.forRoot({
      dependencies: [infraModule],
      key: { algorithm: 'HMAC', secretKey: 'secretKey' },
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
