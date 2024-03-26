import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1711439248849 implements MigrationInterface {
    name = 'AutoGenerate1711439248849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "company_id" bigint NOT NULL, "project_scope_id" bigint NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "type_flag" integer NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proposal" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "project_id" integer NOT NULL, "student_id" integer NOT NULL, "cover_letter" character varying NOT NULL, "status_flag" integer NOT NULL, "disable_flag" integer NOT NULL, CONSTRAINT "PK_ca872ecfe4fef5720d2d39e4275" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "education" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "student_id" integer NOT NULL, "school_name" character varying NOT NULL, "start_year" TIMESTAMP NOT NULL, "end_year" TIMESTAMP NOT NULL, CONSTRAINT "PK_bf3d38701b3030a8ad634d43bd6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "student_id" integer NOT NULL, "title" character varying NOT NULL, "start_month" TIMESTAMP NOT NULL, "end_month" TIMESTAMP NOT NULL, "description" character varying, CONSTRAINT "PK_5e8d5a534100e1b17ee2efa429a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "language" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "student_id" integer NOT NULL, "language_name" character varying NOT NULL, "level" character varying NOT NULL, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skillSet" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_c0533ac5e1a8329de231edaf9bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tech_stack" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_28ce6942fffe078dd648ae71d4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, "fullname" character varying NOT NULL, "tech_stack_id" integer, "resume" character varying, "transcript" character varying, CONSTRAINT "REL_0cc43638ebcf41dfab27e62dc0" UNIQUE ("user_id"), CONSTRAINT "REL_6c70ebe41780fbf6b7f95af420" UNIQUE ("tech_stack_id"), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, "roles" text array NOT NULL DEFAULT '{USER}', "isConfirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" bigint NOT NULL, "fullname" character varying NOT NULL, "company_name" character varying, "website" character varying, "size" character varying NOT NULL, "description" character varying, "userId" integer, CONSTRAINT "REL_c41a1d36702f2cd0403ce58d33" UNIQUE ("userId"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student_skill_sets_skill_set" ("studentId" integer NOT NULL, "skillSetId" integer NOT NULL, CONSTRAINT "PK_abf84b87f12f092b213887362d7" PRIMARY KEY ("studentId", "skillSetId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a06a9218635dca94573c6e8dda" ON "student_skill_sets_skill_set" ("studentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_33427ab594df5fe6f53cb78d03" ON "student_skill_sets_skill_set" ("skillSetId") `);
        await queryRunner.query(`ALTER TABLE "proposal" ADD CONSTRAINT "FK_cc40b9cbd32d498a4130818b83d" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "proposal" ADD CONSTRAINT "FK_e318d6567d5374116e2d7710402" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_0a4de5537f8f9e8475e21c84719" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience" ADD CONSTRAINT "FK_ec5f5e26e58b3e97ce7b711bf7c" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "language" ADD CONSTRAINT "FK_863483ad2f2b616484832fce269" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_6c70ebe41780fbf6b7f95af420f" FOREIGN KEY ("tech_stack_id") REFERENCES "tech_stack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_c41a1d36702f2cd0403ce58d33a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_skill_sets_skill_set" ADD CONSTRAINT "FK_a06a9218635dca94573c6e8dda4" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "student_skill_sets_skill_set" ADD CONSTRAINT "FK_33427ab594df5fe6f53cb78d03f" FOREIGN KEY ("skillSetId") REFERENCES "skillSet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_skill_sets_skill_set" DROP CONSTRAINT "FK_33427ab594df5fe6f53cb78d03f"`);
        await queryRunner.query(`ALTER TABLE "student_skill_sets_skill_set" DROP CONSTRAINT "FK_a06a9218635dca94573c6e8dda4"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_c41a1d36702f2cd0403ce58d33a"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_6c70ebe41780fbf6b7f95af420f"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_0cc43638ebcf41dfab27e62dc09"`);
        await queryRunner.query(`ALTER TABLE "language" DROP CONSTRAINT "FK_863483ad2f2b616484832fce269"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP CONSTRAINT "FK_ec5f5e26e58b3e97ce7b711bf7c"`);
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_0a4de5537f8f9e8475e21c84719"`);
        await queryRunner.query(`ALTER TABLE "proposal" DROP CONSTRAINT "FK_e318d6567d5374116e2d7710402"`);
        await queryRunner.query(`ALTER TABLE "proposal" DROP CONSTRAINT "FK_cc40b9cbd32d498a4130818b83d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33427ab594df5fe6f53cb78d03"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a06a9218635dca94573c6e8dda"`);
        await queryRunner.query(`DROP TABLE "student_skill_sets_skill_set"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TABLE "tech_stack"`);
        await queryRunner.query(`DROP TABLE "skillSet"`);
        await queryRunner.query(`DROP TABLE "language"`);
        await queryRunner.query(`DROP TABLE "experience"`);
        await queryRunner.query(`DROP TABLE "education"`);
        await queryRunner.query(`DROP TABLE "proposal"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
