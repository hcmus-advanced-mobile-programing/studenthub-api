import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDateField1712329163586 implements MigrationInterface {
    name = 'UpdateDateField1712329163586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_c41a1d36702f2cd0403ce58d33a"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "REL_c41a1d36702f2cd0403ce58d33"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "start_year"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "start_year" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "end_year"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "end_year" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "start_month"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "start_month" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "end_month"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "end_month" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "end_month"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "end_month" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "start_month"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "start_month" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "end_year"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "end_year" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "start_year"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "start_year" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "REL_c41a1d36702f2cd0403ce58d33" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_c41a1d36702f2cd0403ce58d33a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
