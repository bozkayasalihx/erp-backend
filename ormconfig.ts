/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();

module.exports = {
    type: "postgres",
    database: process.env.DB_NAME,
    host: process.env.HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD,
    // namingStrategy: new SnakeNamingStrategy(),
    synchronize: true,
    entities: ["dist/models/*.js"],
    // subscribers: !__prod__ ? [UserCreateSubs] : undefined,
    // migrations: !__prod__ ? [migrationDir] : undefined,
    logger: "advanced-console",
    seeds: ["./src/seeders/*.ts"],
    // factories: ["./src/factories/*.ts"],
};
