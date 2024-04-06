import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProjectScopeProjectTable1711699565280 implements MigrationInterface {
    name = 'AlterProjectScopeProjectTable1711699565280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "project_scope_id" TO "project_scope_flag"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "project_scope_flag"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "project_scope_flag" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "project_scope_flag"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "project_scope_flag" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "project_scope_flag" TO "project_scope_id"`);
    }

}
