import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1714116586113 implements MigrationInterface {
    name = 'AutoGenerate1714116586113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview" DROP CONSTRAINT "FK_de784f63d77e1d1b474bb0bc326"`);
        await queryRunner.query(`ALTER TABLE "interview" ALTER COLUMN "meeting_room_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "interview" ADD CONSTRAINT "FK_de784f63d77e1d1b474bb0bc326" FOREIGN KEY ("meeting_room_id") REFERENCES "meeting_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview" DROP CONSTRAINT "FK_de784f63d77e1d1b474bb0bc326"`);
        await queryRunner.query(`ALTER TABLE "interview" ALTER COLUMN "meeting_room_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "interview" ADD CONSTRAINT "FK_de784f63d77e1d1b474bb0bc326" FOREIGN KEY ("meeting_room_id") REFERENCES "meeting_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
