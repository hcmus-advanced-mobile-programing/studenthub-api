import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterFavoriteProjectTable1711700253595 implements MigrationInterface {
    name = 'AlterFavoriteProjectTable1711700253595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_project" ALTER COLUMN "disable_flag" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_project" ALTER COLUMN "disable_flag" DROP DEFAULT`);
    }

}
