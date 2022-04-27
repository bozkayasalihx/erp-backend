//@ts-nocheck
import path from "path";
import { DataSource } from "typeorm";
import SnakeNamingStrategy from "../configs/typeormNamingStrategy";
import { __prod__ } from "../scripts/dev";
import { UserCreateSubs } from "../subscribers/userSubs";

const entityDir = path.join(__dirname, "../../dist/models/*.js");
const subsDir = path.join(__dirname, "../../dist/subscribers/*.js");

export const appDataSource = new DataSource({
    type: "postgres",
    database: process.env.DB_NAME,
    host: process.env.HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD,
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: true,
    entities: [entityDir],
    subscribers: !__prod__ ? [UserCreateSubs] : undefined,
    logger: "advanced-console",
});

const connectDb = async () => {
    await appDataSource.initialize();
};
export { connectDb };
