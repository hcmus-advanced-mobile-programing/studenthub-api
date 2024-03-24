import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateInterviewTable1711218980136 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
          new Table({
            name: 'interview',
            columns: [
              {
                name: 'id',
                type: 'bigint',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'title',
                type: 'text',
                isNullable: true,
              },
              {
                name: 'disable_flag',
                type: 'smallint',
                isNullable: false,
                default: 0,
              },
              {
                name: 'start_time',
                type: 'timestamp',
                isNullable: true,
              },
              {
                name: 'end_time',
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
        await queryRunner.dropTable('interview');
      }

}
