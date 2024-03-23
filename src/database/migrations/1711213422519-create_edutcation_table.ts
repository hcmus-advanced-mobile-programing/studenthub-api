import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEdutcationTable1711213422519 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'education',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'student_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'school_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'start_year',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'end_year',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('education');
  }
}
