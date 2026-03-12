import { DynamicModule } from '@nestjs/common';

export interface AppConfig {
  dependencies: DynamicModule[];
  privateKey: string;
}
