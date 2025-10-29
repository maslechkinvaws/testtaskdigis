import { ConfigModule } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common';

export function createConfigModule(): Promise<DynamicModule> {
  return ConfigModule.forRoot({
    envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    isGlobal: true,
  });
}
