import { Module } from '@nestjs/common';
import { createTypeormModule } from './database/typeorm.provider';
import { createConfigModule } from './config/config-module.provider';
import { RecordModule } from './modules/record/record.module';

@Module({
  imports: [
    createTypeormModule({ loadMigrations: true }),
    createConfigModule(),
    RecordModule,
  ],
})
export class AppModule {}
