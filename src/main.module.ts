import { DynamicModule, Module } from '@nestjs/common';
import { AppModule } from '@app/app.module';
import { readFileSync } from 'fs';
import { InfraModule } from '@infra/infra.module';
import { AdapterModule } from '@adapter/adapter.module';
import { resolve } from 'path';

@Module({})
export class MainModule {
  static forRoot(): DynamicModule {
    const keyPath = resolve(process.cwd(), 'docs/example_private_key.pem');
    const privateKey = readFileSync(keyPath, 'utf8');

    const infraModule = InfraModule.forRoot({
      dependencies: [],
      mongoUri: 'mongodb://localhost:27017/authdb',
    });

    const appModule = AppModule.forRoot({
      dependencies: [infraModule],
      privateKey,
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
