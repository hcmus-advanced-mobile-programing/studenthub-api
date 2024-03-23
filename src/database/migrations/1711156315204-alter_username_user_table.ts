import { Column, MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AlterUsernameUserTable1711156315204 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "username");

        await queryRunner.addColumn("user", new TableColumn({
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false
        }),);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "email");

        await queryRunner.addColumn("user", new TableColumn({
            name: 'username',
            type: 'varchar',
            length: '100',
            isNullable: false
        }),);
    }

}
