import path from "path";
import { DataSource } from "typeorm";
import SnakeNamingStrategy from "../configs/typeormNamingStrategy";

const entityDir = path.join(__dirname, "../../dist/models/*.js");
const subsDir = path.join(__dirname, "../../dist/subscribers/*.js");
const entityDir2 = path.join(__dirname, "../models/*.ts");
const subsDir2 = path.join(__dirname, "../subscribers/*.ts");

export const appDataSource = new DataSource({
    type: "postgres",
    database: process.env.DB_NAME,
    host: process.env.HOST,
    port: +(process.env.DB_PORT as string),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD,
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: true,
    entities: [entityDir, entityDir2],
    subscribers: [subsDir, subsDir2],
    logger: "advanced-console",
});

const connectDb = async () => {
    await appDataSource.initialize();
};
export { connectDb };
