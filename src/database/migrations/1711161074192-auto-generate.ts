import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1711161074192 implements MigrationInterface {
    name = 'AutoGenerate1711161074192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "base" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_ee39d2f844e458c187af0e5383f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "base"`);
    }

}
