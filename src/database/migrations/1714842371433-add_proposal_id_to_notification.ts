import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProposalIdToNotification1714842371433 implements MigrationInterface {
  name = 'AddProposalIdToNotification1714842371433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" ADD "proposal_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_e3ad72daa9d65199b4a198dc806" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_e3ad72daa9d65199b4a198dc806"`);
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "proposal_id"`);
  }
}
