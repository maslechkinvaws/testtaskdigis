import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { faker } from '@faker-js/faker';
import { Record } from '../../modules/record/entities/record.entity';

async function bootstrap() {
  const count = parseInt(process.argv[2], 10);
  const append = process.argv.includes('--append');

  if (isNaN(count) || count <= 0) {
    console.error('Please provide a positive number of records.');
    console.error('Example: npm run seed:records 100 [--append]');
    process.exit(1);
  }

  const appContext = await NestFactory.createApplicationContext(AppModule);
  const dataSource = appContext.get(DataSource);
  const repository = dataSource.getRepository(Record);

  if (!append) {
    console.log('Delete items in "records" table');
    await repository.query('TRUNCATE TABLE records RESTART IDENTITY CASCADE');
  } else {
    console.log('Append mode (keeping existing records)');
  }

  const records: Partial<Record>[] = [];
  for (let i = 0; i < count; i++) {
    records.push({
      title: faker.lorem.words(3),
      value: faker.number.int({ min: 1, max: 1000 }),
      description: faker.lorem.sentence(),
    });
  }

  await repository.createQueryBuilder().insert().values(records).execute();

  const total = await repository.count();
  console.log(`Seeded ${count} new records. Total in DB: ${total}`);

  await appContext.close();
}

bootstrap();
