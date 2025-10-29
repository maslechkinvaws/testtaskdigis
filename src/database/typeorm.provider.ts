import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Record } from '../modules/record/entities/record.entity';

const isProd = process.env.NODE_ENV === 'production';
const BASE_DIR = isProd ? `${__dirname}/../../dist` : `${__dirname}/../`;
const logger = new Logger('TypeORM');

export function createTypeormModule(
  options: { loadMigrations?: boolean } = {},
) {
  return TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const dbName = configService.get<string>('DB_NAME');
      const dbUser = configService.get<string>('DB_USERNAME');
      const dbPassword = configService.get<string>('DB_PASSWORD');
      const dbPort = configService.get<number>('DB_PORT');
      const dbHost = configService.get<string>('DB_HOST');

      if (!dbName || !dbUser || !dbPassword || !dbPort || !dbHost) {
        throw new Error('Missing required database configuration parameters');
      }

      const databaseUrl = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

      const migrationsRun = configService.get<boolean>(
        'DB_AUTO_RUN_MIGRATIONS',
        false,
      );

      logger.log(`Database URL: ${databaseUrl}`);
      logger.log(`Auto run migrations: ${migrationsRun}`);
      logger.log(`Load migrations: ${options.loadMigrations}`);

      const entitiesPath = isProd
        ? 'dist/**/*.entity{.ts,.js}'
        : `${BASE_DIR}/entities/**/**/*.entity.{ts,js}`;

      const migrationsPath = isProd
        ? 'dist/migration/*{.ts,.js}'
        : `${BASE_DIR}/database/migrations/**/*.{ts,js}`;

      logger.log(`Entities path: ${entitiesPath}`);
      logger.log(`Migrations path: ${migrationsPath}`);

      return {
        type: 'postgres',
        synchronize: false,
        url: databaseUrl,
        entities: isProd ? ['dist/**/*.entity.js'] : [Record],
        migrations: options.loadMigrations ? [migrationsPath] : [],
        migrationsTableName: 'migrations',
        migrationsRun,
        schema: 'public',
        migrationsTransactionMode: 'each',
        cli: {
          migrationsDir: 'src/database/migrations',
        },
      };
    },
  });
}
