import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1713184810854 implements MigrationInterface {
    name = 'AutoGenerate1713184810854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "typeNotifyFlag" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "typeNotifyFlag"`);
    }

}
