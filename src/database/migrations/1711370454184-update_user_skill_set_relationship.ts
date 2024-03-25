import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserSkillSetRelationship1711370454184 implements MigrationInterface {
  name = 'UpdateUserSkillSetRelationship1711370454184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "student_skill_sets_skill_set" ("studentId" integer NOT NULL, "skillSetId" integer NOT NULL, CONSTRAINT "PK_abf84b87f12f092b213887362d7" PRIMARY KEY ("studentId", "skillSetId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a06a9218635dca94573c6e8dda" ON "student_skill_sets_skill_set" ("studentId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_33427ab594df5fe6f53cb78d03" ON "student_skill_sets_skill_set" ("skillSetId") `
    );
    await queryRunner.query(
      `ALTER TABLE "student_skill_sets_skill_set" ADD CONSTRAINT "FK_a06a9218635dca94573c6e8dda4" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "student_skill_sets_skill_set" ADD CONSTRAINT "FK_33427ab594df5fe6f53cb78d03f" FOREIGN KEY ("skillSetId") REFERENCES "skillSet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_skill_sets_skill_set" DROP CONSTRAINT "FK_33427ab594df5fe6f53cb78d03f"`
    );
    await queryRunner.query(
      `ALTER TABLE "student_skill_sets_skill_set" DROP CONSTRAINT "FK_a06a9218635dca94573c6e8dda4"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_33427ab594df5fe6f53cb78d03"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a06a9218635dca94573c6e8dda"`);
    await queryRunner.query(`DROP TABLE "student_skill_sets_skill_set"`);
  }
}
