import { DynamicModule } from '@nestjs/common';

export interface InfraConfig {
  dependencies: DynamicModule[];
  mongoUri: string;
}
