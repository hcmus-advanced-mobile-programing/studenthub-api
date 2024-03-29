import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1711546770135 implements MigrationInterface {
    name = 'AutoGenerate1711546770135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "UQ_879141ebc259b4c0544b3f1ea4c" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "size" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "size" character varying`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "UQ_879141ebc259b4c0544b3f1ea4c"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "user_id" bigint NOT NULL`);
    }

}
