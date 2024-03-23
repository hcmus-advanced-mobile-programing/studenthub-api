import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProposalTable1711124563964 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'proposal',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'project_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'student_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'cover_letter',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status_flag',
            type: 'smallint',
            isNullable: false,
            default: 0,
          },
          {
            name: 'disable_flag',
            type: 'smallint',
            isNullable: false,
            default: 0,
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
    await queryRunner.dropTable('proposal');
  }
}
