import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationTable1712392940987 implements MigrationInterface {
    name = 'CreateNotificationTable1712392940987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "receiver_id" integer NOT NULL, "sender_id" integer NOT NULL, "message_id" integer, "title" character varying NOT NULL, "notifyFlag" bigint NOT NULL, "typeNotifyFlag" bigint NOT NULL, "content" character varying, CONSTRAINT "REL_bcacc62c929cc4881ec971b679" UNIQUE ("message_id"), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "start_year"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "start_year" integer`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "end_year"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "end_year" integer`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "start_month"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "start_month" character varying`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "end_month"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "end_month" character varying`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_bcacc62c929cc4881ec971b6791" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_90543bacf107cdd564e9b62cd20" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_56023c91b76b36125acd4dcd9c5" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_56023c91b76b36125acd4dcd9c5"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_90543bacf107cdd564e9b62cd20"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_bcacc62c929cc4881ec971b6791"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "end_month"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "end_month" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "start_month"`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "start_month" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "end_year"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "end_year" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "start_year"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "start_year" TIMESTAMP NOT NULL`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
