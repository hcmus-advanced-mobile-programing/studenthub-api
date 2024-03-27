import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1711447072353 implements MigrationInterface {
    name = 'AutoGenerate1711447072353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "size" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "size" SET NOT NULL`);
    }

}
