import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1711987065726 implements MigrationInterface {
    name = 'AutoGenerate1711987065726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "company_id" bigint NOT NULL, "project_scope_flag" integer NOT NULL DEFAULT '0', "title" character varying NOT NULL, "description" character varying NOT NULL, "type_flag" integer NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proposal" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "project_id" integer NOT NULL, "student_id" integer NOT NULL, "cover_letter" character varying NOT NULL, "status_flag" integer NOT NULL, "disable_flag" integer NOT NULL, CONSTRAINT "PK_ca872ecfe4fef5720d2d39e4275" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "education" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "student_id" integer NOT NULL, "school_name" character varying NOT NULL, "start_year" TIMESTAMP NOT NULL, "end_year" TIMESTAMP NOT NULL, CONSTRAINT "PK_bf3d38701b3030a8ad634d43bd6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skillSet" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_c0533ac5e1a8329de231edaf9bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "student_id" integer NOT NULL, "title" character varying NOT NULL, "start_month" TIMESTAMP NOT NULL, "end_month" TIMESTAMP NOT NULL, "description" character varying, CONSTRAINT "PK_5e8d5a534100e1b17ee2efa429a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "language" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "student_id" integer NOT NULL, "language_name" character varying NOT NULL, "level" character varying NOT NULL, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tech_stack" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_28ce6942fffe078dd648ae71d4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, "tech_stack_id" integer, "resume" character varying, "transcript" character varying, CONSTRAINT "REL_0cc43638ebcf41dfab27e62dc0" UNIQUE ("user_id"), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "fullname" character varying NOT NULL, "password" character varying NOT NULL, "roles" text array NOT NULL DEFAULT '{USER}', "verified" boolean NOT NULL DEFAULT false, "isConfirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, "company_name" character varying, "website" character varying, "size" integer, "description" character varying, CONSTRAINT "REL_879141ebc259b4c0544b3f1ea4" UNIQUE ("user_id"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite_project" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "project_id" integer NOT NULL, "student_id" integer NOT NULL, "disable_flag" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_9756855e5a1f278aca9daaf06dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "sender_id" integer NOT NULL, "receiver_id" integer NOT NULL, "content" character varying NOT NULL, "message_flag" character varying NOT NULL, "project_id" integer NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "sender_id" integer NOT NULL, "receiver_id" integer NOT NULL, "content" character varying NOT NULL, "title" character varying NOT NULL, "message_id" integer NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience_skill_sets_skill_set" ("experienceId" integer NOT NULL, "skillSetId" integer NOT NULL, CONSTRAINT "PK_6a627431cd8db8371280c870219" PRIMARY KEY ("experienceId", "skillSetId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7f3111689cd8504f3734f7f9e7" ON "experience_skill_sets_skill_set" ("experienceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9ac2cac380e179d79075b1ea9" ON "experience_skill_sets_skill_set" ("skillSetId") `);
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
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_project" ADD CONSTRAINT "FK_440a405c638205acde4b8d0d91e" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_project" ADD CONSTRAINT "FK_e6d4cb4e7db6cc3229e8274e9ae" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f4da40532b0102d51beb220f16a" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_9129d672673e467003c482aa88b" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_56023c91b76b36125acd4dcd9c5" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_90543bacf107cdd564e9b62cd20" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_bcacc62c929cc4881ec971b6791" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_skill_sets_skill_set" ADD CONSTRAINT "FK_7f3111689cd8504f3734f7f9e7b" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "experience_skill_sets_skill_set" ADD CONSTRAINT "FK_d9ac2cac380e179d79075b1ea96" FOREIGN KEY ("skillSetId") REFERENCES "skillSet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_skill_sets_skill_set" ADD CONSTRAINT "FK_a06a9218635dca94573c6e8dda4" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "student_skill_sets_skill_set" ADD CONSTRAINT "FK_33427ab594df5fe6f53cb78d03f" FOREIGN KEY ("skillSetId") REFERENCES "skillSet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_skill_sets_skill_set" DROP CONSTRAINT "FK_33427ab594df5fe6f53cb78d03f"`);
        await queryRunner.query(`ALTER TABLE "student_skill_sets_skill_set" DROP CONSTRAINT "FK_a06a9218635dca94573c6e8dda4"`);
        await queryRunner.query(`ALTER TABLE "experience_skill_sets_skill_set" DROP CONSTRAINT "FK_d9ac2cac380e179d79075b1ea96"`);
        await queryRunner.query(`ALTER TABLE "experience_skill_sets_skill_set" DROP CONSTRAINT "FK_7f3111689cd8504f3734f7f9e7b"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_bcacc62c929cc4881ec971b6791"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_90543bacf107cdd564e9b62cd20"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_56023c91b76b36125acd4dcd9c5"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_9129d672673e467003c482aa88b"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f4da40532b0102d51beb220f16a"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6"`);
        await queryRunner.query(`ALTER TABLE "favorite_project" DROP CONSTRAINT "FK_e6d4cb4e7db6cc3229e8274e9ae"`);
        await queryRunner.query(`ALTER TABLE "favorite_project" DROP CONSTRAINT "FK_440a405c638205acde4b8d0d91e"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_879141ebc259b4c0544b3f1ea4c"`);
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
        await queryRunner.query(`DROP INDEX "public"."IDX_d9ac2cac380e179d79075b1ea9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7f3111689cd8504f3734f7f9e7"`);
        await queryRunner.query(`DROP TABLE "experience_skill_sets_skill_set"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "favorite_project"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TABLE "tech_stack"`);
        await queryRunner.query(`DROP TABLE "language"`);
        await queryRunner.query(`DROP TABLE "experience"`);
        await queryRunner.query(`DROP TABLE "skillSet"`);
        await queryRunner.query(`DROP TABLE "education"`);
        await queryRunner.query(`DROP TABLE "proposal"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
