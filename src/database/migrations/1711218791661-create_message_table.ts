import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMessageTable1711218791661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'message',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'receiver_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'sender_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'interview_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'project_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'message_flag',
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
    await queryRunner.dropTable('message');
  }
}
