import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterVerifiedUserTable1711890689626 implements MigrationInterface {
    name = 'AlterVerifiedUserTable1711890689626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verified"`);
    }

}
