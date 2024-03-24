import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateStudentSkillSetTable1711218074675 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
          new Table({
            name: 'student_skill_set',
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
                name: 'skill_set_id',
                type: 'bigint',
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
        await queryRunner.dropTable('student_skill_set');
      }

}
