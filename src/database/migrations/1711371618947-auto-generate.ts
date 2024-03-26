import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1711371618947 implements MigrationInterface {
    name = 'AutoGenerate1711371618947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "PK_3d8016e1cb58429474a3c041904"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "updated_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "deleted_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "UQ_0cc43638ebcf41dfab27e62dc09" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "fullname"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "fullname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "tech_stack_id"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "tech_stack_id" integer`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "UQ_6c70ebe41780fbf6b7f95af420f" UNIQUE ("tech_stack_id")`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_6c70ebe41780fbf6b7f95af420f" FOREIGN KEY ("tech_stack_id") REFERENCES "tech_stack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_6c70ebe41780fbf6b7f95af420f"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "UQ_6c70ebe41780fbf6b7f95af420f"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "tech_stack_id"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "tech_stack_id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "fullname"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "fullname" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "UQ_0cc43638ebcf41dfab27e62dc09"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "user_id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "deleted_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "updated_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "created_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "PK_3d8016e1cb58429474a3c041904"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id")`);
    }

}
