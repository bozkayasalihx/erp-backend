import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import "reflect-metadata";
import { event } from "./configs";
import { connectDb } from "./loaders/database";
import { meRoute, testRoute, userRoute } from "./routes";

const main = async () => {
    await connectDb();
    event();
    const app = express();

    app.use(express.json());
    app.use(
        cors({
            origin: process.env.ORIGIN,
            credentials: true,
        })
    );

    app.use(cookieParser());
    app.use(helmet());
    // app.use(csurf({ cookie: true }));
    app.use(morgan("dev"));

    app.use("/api", userRoute);
    app.use("/api", meRoute);
    app.use("/api", testRoute);

    app.listen(process.env.PORT, () => {
        console.log("server started at port: " + process.env.PORT);
    });
};
main().catch((err) => {
    console.log("server down =>", err);
    process.exit(1);
});
