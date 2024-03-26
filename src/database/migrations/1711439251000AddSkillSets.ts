import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSkillSets1711439251000 implements MigrationInterface {
    name = 'AddSkillSets1711439251000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const skillSets = [
            "C++",
            "C#",
            "Flutter",
            "NodeJS",
            "PHP",
            "Dart",
            "Java",
            "React",
            "AWS",
            "MySQL",
            "CI/CD",
            "Go",
            "Kotlin"
        ];

        for (const skill of skillSets) {
            await queryRunner.query(`INSERT INTO "skillSet" (name) VALUES ('${skill}')`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const skillSets = [
            "C++",
            "C#",
            "Flutter",
            "NodeJS",
            "PHP",
            "Dart",
            "Java",
            "React",
            "AWS",
            "MySQL",
            "CI/CD",
            "Go",
            "Kotlin"
        ];

        for (const skill of skillSets) {
            await queryRunner.query(`DELETE FROM "skillSet" WHERE name = '${skill}'`);
        }
    }

}