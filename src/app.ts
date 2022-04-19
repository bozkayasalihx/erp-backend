import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { event } from "./configs";
import { connectDb } from "./loaders/database";
import {
    fileUpload as fileUploadRoute,
    meRoute,
    testRoute,
    userRoute,
} from "./routes";
import { __prod__ } from "./scripts/dev";

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

    app.use("/static", express.static(path.join(__dirname, "../src/public")));
    app.use(
        fileUpload({
            limits: {
                fileSize: 10 * 1024 * 1024, // 1omb
            },
            useTempFiles: true,
            tempFileDir: "/temp/",
            debug: !__prod__,
        })
    );

    app.use("/api", userRoute);
    app.use("/api", meRoute);
    app.use("/api", testRoute);
    app.use("/api", fileUploadRoute);

    app.listen(process.env.PORT, () => {
        console.log("server started at port: " + process.env.PORT);
    });
};
main().catch((err) => {
    console.log("server down =>", err);
    process.exit(1);
});
