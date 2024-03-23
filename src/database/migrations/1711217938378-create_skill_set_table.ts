import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateSkillSetTable1711217938378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
          new Table({
            name: 'skill_set',
            columns: [
              {
                name: 'id',
                type: 'bigint',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'name',
                type: 'varchar',
                length: '100',
                isNullable: false,
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
        await queryRunner.dropTable('skill_set');
      }

}
