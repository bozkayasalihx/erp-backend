import { MigrationInterface, QueryRunner } from "typeorm";

export class UserMigration implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        //
        await queryRunner.query(
            "INSERT INTO user_tbl (username, email, password, user_type, tckn, mobile) VALUES (salih, jamesgosling10@gmail.com, 32428342394832948, VA, 11676348623, 5789235532)"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //
    }
}
