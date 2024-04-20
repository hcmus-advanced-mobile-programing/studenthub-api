import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterDefaultFlag1713610729391 implements MigrationInterface {
    name = 'AlterDefaultFlag1713610729391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "type_flag" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "proposal" ALTER COLUMN "status_flag" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "proposal" ALTER COLUMN "disable_flag" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "typeNotifyFlag" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "typeNotifyFlag" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "proposal" ALTER COLUMN "disable_flag" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "proposal" ALTER COLUMN "status_flag" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "type_flag" DROP DEFAULT`);
    }

}
