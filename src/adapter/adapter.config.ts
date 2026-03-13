import { DynamicModule } from '@nestjs/common';

export interface AdapterConfig {
  dependencies: DynamicModule[];
}
