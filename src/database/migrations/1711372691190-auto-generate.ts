import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1711372691190 implements MigrationInterface {
    name = 'AutoGenerate1711372691190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "UQ_c41a1d36702f2cd0403ce58d33a" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "fullname"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "fullname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "company_name"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "company_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "website" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_c41a1d36702f2cd0403ce58d33a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_c41a1d36702f2cd0403ce58d33a"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "website" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "company_name"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "company_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "fullname"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "fullname" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "created_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "UQ_c41a1d36702f2cd0403ce58d33a"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "userId"`);
    }

}
