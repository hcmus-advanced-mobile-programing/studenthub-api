import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreTechStacks1711439250000 implements MigrationInterface {
    name = 'AddMoreTechStacks1711439250000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const techStacks = [
            "Fullstack Engineer",
            "Frontend Developer",
            "Backend Developer"
        ];

        for (const techStack of techStacks) {
            await queryRunner.query(`INSERT INTO "tech_stack" (name) VALUES ('${techStack}')`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const techStacks = [
            "Fullstack Engineer",
            "Frontend Developer",
            "Backend Developer"
        ];

        for (const techStack of techStacks) {
            await queryRunner.query(`DELETE FROM "tech_stack" WHERE name = '${techStack}'`);
        }
    }
}
