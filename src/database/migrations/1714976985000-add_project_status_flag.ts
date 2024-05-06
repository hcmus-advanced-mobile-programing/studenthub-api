import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectStatusFlag1714976985000 implements MigrationInterface {
  name = 'AddProjectStatusFlag1714976985000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" ADD "status" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "status"`);
  }
}
