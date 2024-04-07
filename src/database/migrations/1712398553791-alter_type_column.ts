import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTypeColumn1712398553791 implements MigrationInterface {
    name = 'AlterTypeColumn1712398553791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "education" ALTER COLUMN "start_year" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" ALTER COLUMN "end_year" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "start_month" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "end_month" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roles" integer array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roles" text array NOT NULL DEFAULT '{USER}'`);
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "end_month" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "start_month" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" ALTER COLUMN "end_year" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" ALTER COLUMN "start_year" DROP NOT NULL`);
    }

}
