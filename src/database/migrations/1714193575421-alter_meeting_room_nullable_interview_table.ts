import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMeetingRoomNullableInterviewTable1714193575421 implements MigrationInterface {
    name = 'AlterMeetingRoomNullableInterviewTable1714193575421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview" ADD "meeting_room_id" integer`);
        await queryRunner.query(`ALTER TABLE "interview" ADD CONSTRAINT "UQ_de784f63d77e1d1b474bb0bc326" UNIQUE ("meeting_room_id")`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "typeNotifyFlag" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "interview" ADD CONSTRAINT "FK_de784f63d77e1d1b474bb0bc326" FOREIGN KEY ("meeting_room_id") REFERENCES "meeting_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview" DROP CONSTRAINT "FK_de784f63d77e1d1b474bb0bc326"`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "typeNotifyFlag" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "interview" DROP CONSTRAINT "UQ_de784f63d77e1d1b474bb0bc326"`);
        await queryRunner.query(`ALTER TABLE "interview" DROP COLUMN "meeting_room_id"`);
    }

}
