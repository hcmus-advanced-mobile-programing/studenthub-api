import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterSizeCompanyTable1711702558771 implements MigrationInterface {
    name = 'AlterSizeCompanyTable1711702558771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "size" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "size" SET NOT NULL`);
    }

}
