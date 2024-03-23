import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterEmailStudentTable1711159664578 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("student", "email");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("student", new TableColumn({
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false
        }),);
    }

}
