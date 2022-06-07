import SnakeNamingStrategy from "./src/configs/typeormNamingStrategy";
export default {
    type: "postgres",
    database: "test",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: true,
    entities: ["./src/models/*.ts"],
    // subscribers: !__prod__ ? [UserCreateSubs] : undefined,
    logger: "advanced-console",
    seeds: ["./src/models/seed_generator/seeds/*.ts"],
    factories: ["./src/models/seed_generator/factories/*.ts"],
};
