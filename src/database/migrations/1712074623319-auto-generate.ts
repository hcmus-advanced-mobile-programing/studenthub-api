import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1712074623319 implements MigrationInterface {
    name = 'AutoGenerate1712074623319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "numberOfStudents" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "numberOfStudents"`);
    }

}
