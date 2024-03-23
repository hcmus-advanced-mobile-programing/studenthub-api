import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterProjectAddCompanyId1628203411386 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn("project", new TableColumn({
            name: 'company_id',
            type: 'bigint',
            isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("project", "company_id");
    }
}
