import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterEmailCompanyTable1711159641526 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('company', 'email');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'company',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        length: '255',
        isUnique: true,
        isNullable: false,
      })
    );
  }
}
