import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterNumberOfStudentsProjectTable1712151904772 implements MigrationInterface {
    name = 'AlterNumberOfStudentsProjectTable1712151904772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "number_of_students" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "number_of_students"`);
    }

}
