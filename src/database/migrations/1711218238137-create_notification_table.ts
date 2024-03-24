import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateNotificationTable1711218238137 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
          new Table({
            name: 'notification',
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
                name: 'message_id',
                type: 'bigint',
                isNullable: true,
              },
              {
                name: 'title',
                type: 'text',
                isNullable: true,
              },
              {
                name: 'content',
                type: 'text',
                isNullable: true,
              },
              {
                name: 'notify_flag',
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
        await queryRunner.dropTable('notification');
      }

}
