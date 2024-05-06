import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectStatusFlag1714976985000 implements MigrationInterface {
  name = 'AddProjectStatusFlag1714976985000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_c41a1d36702f2cd0403ce58d33a"`);
    await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "REL_c41a1d36702f2cd0403ce58d33"`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "project" ADD "status" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_bcacc62c929cc4881ec971b6791"`);
    await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "REL_bcacc62c929cc4881ec971b679"`);
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_bcacc62c929cc4881ec971b6791" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_bcacc62c929cc4881ec971b6791"`);
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "REL_bcacc62c929cc4881ec971b679" UNIQUE ("message_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_bcacc62c929cc4881ec971b6791" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "userId" integer`);
    await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "REL_c41a1d36702f2cd0403ce58d33" UNIQUE ("userId")`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "FK_c41a1d36702f2cd0403ce58d33a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
