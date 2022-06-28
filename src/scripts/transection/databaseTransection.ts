/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-named-as-default */
import { DataSource, QueryRunner } from "typeorm";
import appDataSource, { dataSourceOptions } from "../../loaders/database";

export default class DatabaseTransaction {
    private static connection: DataSource;

    public static connect() {
        DatabaseTransaction.connection = appDataSource;
        if (!DatabaseTransaction.connection.isInitialized) {
            DatabaseTransaction.connection = new DataSource(dataSourceOptions);
            return DatabaseTransaction.connection;
        }
        return DatabaseTransaction.connection;
    }

    public static async transection<T>(
        callback: (
            error: Error | null,
            queryRunner: QueryRunner | null
        ) => Promise<T>,
        handler?: (valid: boolean) => void
    ) {
        const dataSource = DatabaseTransaction.connect();
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await callback(null, queryRunner);
            handler && handler(true);
            await queryRunner.commitTransaction();
        } catch (err) {
            await callback(err, null);
            handler && handler(false);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
