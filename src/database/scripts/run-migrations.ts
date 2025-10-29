import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { MigrationsModule } from '../../config/typeorm';

export async function runMigrations(skipIfTableExists = false): Promise<void> {
  const logger = new Logger('Migrations');
  try {
    logger.log('Starting migrations...');
    logger.log(`Environment: NODE_ENV=${process.env.NODE_ENV}`);
    logger.log(`Database configuration: 
      HOST=${process.env.DB_HOST}, 
      PORT=${process.env.DB_PORT}, 
      NAME=${process.env.DB_NAME},
      SSL=${process.env.DATABASE_SSL_ENABLED}
    `);

    const app = await NestFactory.createApplicationContext(MigrationsModule);
    const dataSource = app.get(DataSource);

    if (skipIfTableExists) {
      try {
        logger.log('Checking if migrations table exists...');
        const tableExists: { exists: boolean }[] = await dataSource.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name = 'migrations'
          );
        `);

        logger.log(
          `Migrations table exists check result: ${JSON.stringify(tableExists)}`,
        );

        if (tableExists?.[0]?.exists) {
          logger.log('Migrations table already exists, skipping migrations');
          await app.close();
          return;
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          logger.warn(
            `Failed to check migrations table existence: ${error.message}`,
          );
          logger.warn(error.stack);
        } else {
          logger.warn(`Unknown error: ${JSON.stringify(error)}`);
        }
      }
    }

    logger.log('Available migrations:');
    dataSource.migrations.forEach((migration, index) => {
      logger.log(`${index + 1}. ${migration.name}`);
    });

    logger.log('Running migrations...');
    const result = await dataSource.runMigrations();
    logger.log(`Migrations executed: ${result.length}`);
    result.forEach((migration) => {
      logger.log(`✅ Applied migration: ${migration.name}`);
    });

    logger.log('Migrations completed successfully');
    await app.close();
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(
        `Error during migration execution: ${error.message}`,
        error.stack,
      );
    } else {
      logger.error(`Unknown error: ${JSON.stringify(error)}`);
    }
    throw error;
  }
}

if (require.main === module) {
  const skipIfTableExists = process.argv.includes('--skip-if-exists');

  runMigrations(skipIfTableExists)
    .then(() => {
      process.exit(0);
    })
    .catch((error: unknown) => {
      if (error instanceof Error) {
        console.error('Error during migration execution:', error.message);
        console.error(error.stack);
      } else {
        console.error('Unknown error during migration execution:', error);
      }
      process.exit(1);
    });
}
