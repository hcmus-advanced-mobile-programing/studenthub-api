import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1711372782602 implements MigrationInterface {
    name = 'AutoGenerate1711372782602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "company_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "website" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "website" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "company_name" SET NOT NULL`);
    }

}
