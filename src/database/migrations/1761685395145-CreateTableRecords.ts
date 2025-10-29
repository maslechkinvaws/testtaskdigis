import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableResources1761685395145 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "records" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" VARCHAR(255) NOT NULL,
        "value" INT NOT NULL,
        "description" TEXT,
        "created_at" TIMESTAMP DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_resources_created_at" ON "records" ("created_at");
      CREATE INDEX "idx_resources_value" ON "records" ("value");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "records";`);
  }
}
