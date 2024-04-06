import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExperienceSkillSets1711549258441 implements MigrationInterface {
  name = 'AddExperienceSkillSets1711549258441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "experience_skill_sets_skill_set" ("experienceId" integer NOT NULL, "skillSetId" integer NOT NULL, CONSTRAINT "PK_6a627431cd8db8371280c870219" PRIMARY KEY ("experienceId", "skillSetId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7f3111689cd8504f3734f7f9e7" ON "experience_skill_sets_skill_set" ("experienceId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d9ac2cac380e179d79075b1ea9" ON "experience_skill_sets_skill_set" ("skillSetId") `
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "size"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "size" integer`);
    await queryRunner.query(
      `ALTER TABLE "experience_skill_sets_skill_set" ADD CONSTRAINT "FK_7f3111689cd8504f3734f7f9e7b" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "experience_skill_sets_skill_set" ADD CONSTRAINT "FK_d9ac2cac380e179d79075b1ea96" FOREIGN KEY ("skillSetId") REFERENCES "skillSet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "experience_skill_sets_skill_set" DROP CONSTRAINT "FK_d9ac2cac380e179d79075b1ea96"`
    );
    await queryRunner.query(
      `ALTER TABLE "experience_skill_sets_skill_set" DROP CONSTRAINT "FK_7f3111689cd8504f3734f7f9e7b"`
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "size"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "size" character varying`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d9ac2cac380e179d79075b1ea9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7f3111689cd8504f3734f7f9e7"`);
    await queryRunner.query(`DROP TABLE "experience_skill_sets_skill_set"`);
  }
}
