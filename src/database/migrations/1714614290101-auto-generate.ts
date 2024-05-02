import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerate1714614290101 implements MigrationInterface {
    name = 'AutoGenerate1714614290101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_bcacc62c929cc4881ec971b6791"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "REL_bcacc62c929cc4881ec971b679"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_bcacc62c929cc4881ec971b6791" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_bcacc62c929cc4881ec971b6791"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "REL_bcacc62c929cc4881ec971b679" UNIQUE ("message_id")`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_bcacc62c929cc4881ec971b6791" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
