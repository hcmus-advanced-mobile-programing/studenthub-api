import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTypeFlagProjectTable1712538305837 implements MigrationInterface {
    name = 'AlterTypeFlagProjectTable1712538305837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "type_flag" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "type_flag" SET NOT NULL`);
    }

}
