import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateProjectScopeTable1711217448764 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
          new Table({
            name: 'project_scope',
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
                name: 'estimated_start_date',
                type: 'timestamp',
                isNullable: true,
              },
              {
                name: 'estimated_end_date',
                type: 'timestamp',
                isNullable: true,
              },
              {
                name: 'number_of_student',
                type: 'int',
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
        await queryRunner.dropTable('project_scope');
      }

}
