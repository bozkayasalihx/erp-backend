import path from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import SnakeNamingStrategy from "../configs/typeormNamingStrategy";
import { __prod__ } from "../scripts/dev";
import { UserCreateSubs } from "../subscribers/userSubs";
import "./envLoader";

const entityDir = path.join(__dirname, "../../dist/models/*.js");
const entityTsDir = path.join(__dirname, "../models/*.ts");
// const subsDir = path.join(__dirname, "../../dist/subscribers/*.js");
const migrationDir = path.join(__dirname, "../../dist/migrations/*.js");

// eslint-disable-next-line no-console
console.log("env loader env", process.env.POSTGRES_DB);

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    database: process.env.POSTGRES_DB,
    host: process.env.DB_HOST,
    username: process.env.POSTGRES_USER,
    port: process.env.PG_PORT,
    password: process.env.POSTGRES_PASSWORD,
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: true,
    entities: [entityDir, entityTsDir],
    subscribers: !__prod__ ? [UserCreateSubs] : undefined,
    migrations: !__prod__ ? [migrationDir] : undefined,
    logger: !__prod__ ? "advanced-console" : undefined,
    logging: !__prod__ ? ["query", "error"] : false,
};

export const appDataSource = new DataSource(dataSourceOptions);
export default appDataSource;
