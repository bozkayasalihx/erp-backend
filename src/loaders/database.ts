import { DataSource } from "typeorm";
import path from "path";
const entityDir = path.join(__dirname, "../../dist/models/**.js");
export const appDataSource = new DataSource({
    type: "postgres",
    database: process.env.DB_NAME,
    host: process.env.HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD,
    synchronize: true,
    entities: [entityDir],
    logger: "advanced-console",
});

const connectDb = async () => {
    await appDataSource.initialize();
};
export { connectDb };
