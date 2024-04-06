import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTechStackStudentTable1711722865096 implements MigrationInterface {
    name = 'AlterTechStackStudentTable1711722865096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_6c70ebe41780fbf6b7f95af420f"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "REL_6c70ebe41780fbf6b7f95af420"`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_6c70ebe41780fbf6b7f95af420f" FOREIGN KEY ("tech_stack_id") REFERENCES "tech_stack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_6c70ebe41780fbf6b7f95af420f"`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "REL_6c70ebe41780fbf6b7f95af420" UNIQUE ("tech_stack_id")`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_6c70ebe41780fbf6b7f95af420f" FOREIGN KEY ("tech_stack_id") REFERENCES "tech_stack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
