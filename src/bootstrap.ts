import { DataSource } from "typeorm";
import path from "path";
const entityDir = path.join(__dirname, "../dist/models/**.js");
export const appDataSource = new DataSource({
    type: "postgres",
    database: process.env.DB_NAME,
    host: process.env.HOST,
    port: +process.env.DB_PORT!,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    synchronize: true,
    entities: [entityDir],
    logger: "advanced-console",
});
