import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavoriteProjectTable1711698733774 implements MigrationInterface {
    name = 'AddFavoriteProjectTable1711698733774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favorite_project" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "project_id" integer NOT NULL, "student_id" integer NOT NULL, "disable_flag" integer NOT NULL, CONSTRAINT "PK_9756855e5a1f278aca9daaf06dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "size" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "favorite_project" ADD CONSTRAINT "FK_440a405c638205acde4b8d0d91e" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_project" ADD CONSTRAINT "FK_e6d4cb4e7db6cc3229e8274e9ae" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_project" DROP CONSTRAINT "FK_e6d4cb4e7db6cc3229e8274e9ae"`);
        await queryRunner.query(`ALTER TABLE "favorite_project" DROP CONSTRAINT "FK_440a405c638205acde4b8d0d91e"`);
        await queryRunner.query(`ALTER TABLE "company" ALTER COLUMN "size" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "favorite_project"`);
    }

}
