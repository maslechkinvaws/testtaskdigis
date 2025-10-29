import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { createConfigModule } from './config-module.provider';
import { createTypeormModule } from '../database/typeorm.provider';

@Module({
  imports: [
    createConfigModule(),
    createTypeormModule({ loadMigrations: true }),
  ],
})
export class MigrationsModule {}

export default NestFactory.createApplicationContext(MigrationsModule)
  .then((app) => app.get(DataSource))
  .then((dataSource) => Promise.all([dataSource, dataSource.destroy()]))
  .then(([dataSource]) => dataSource);
