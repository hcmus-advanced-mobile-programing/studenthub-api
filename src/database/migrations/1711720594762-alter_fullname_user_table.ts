import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFullnameUserTable1711720594762 implements MigrationInterface {
    name = 'AlterFullnameUserTable1711720594762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "fullname"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "fullname"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "fullname" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fullname"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "fullname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" ADD "fullname" character varying NOT NULL`);
    }

}
