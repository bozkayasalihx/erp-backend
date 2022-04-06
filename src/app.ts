import "dotenv/config";
import express from "express";
import helmet from "helmet";
import "reflect-metadata";
import * as configs from "./configs";
import isLoggedIn from "./middlewares/isLoggedIn";
import { loginRouter, meRoutes } from "./routes";

const main = async () => {
    await configs.appDataSource.initialize();
    const app = express();
    app.use(express.json());
    app.use(helmet());

    app.use("/api", loginRouter);
    app.use("/api", isLoggedIn, meRoutes);
    app.listen(process.env.PORT, () => {
        console.log("server started at port: " + process.env.PORT);
    });
};
main().catch(err => {
    console.log("server down", err);
    process.exit(1);
});
