import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1711372406286 implements MigrationInterface {
    name = 'AutoGenerate1711372406286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "updated_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "deleted_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "deleted_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "updated_at" SET NOT NULL`);
    }

}
