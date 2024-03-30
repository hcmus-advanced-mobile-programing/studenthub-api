import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMeetingRoomTable1711566285000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'meeting_room',
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'meetingRoomCode',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'meetingRoomID',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'expiredAt',
                        type: 'timestamp',
                        isNullable: true, // Set based on whether expiration is optional
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        isNullable: true, // Typically not nullable, but defaults are often set at the DB level
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        isNullable: true, // Typically not nullable; consider triggers for auto-updating
                        onUpdate: 'CURRENT_TIMESTAMP',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'deletedAt',
                        type: 'timestamp',
                        isNullable: true, // Nullable because not all records will be soft deleted
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('meeting_room');
    }
}
