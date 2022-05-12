import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { eventHandler } from "./configs";
import { connectDb } from "./loaders/database";
import { authenticate } from "./middlewares/authenticate";
import {
    buyerRoute,
    dealerRoute,
    fileUpload as fileUploadRoute,
    meRoute,
    testRoute,
    userRelationRoute,
    userRoute,
    vendorRoute,
} from "./routes";

const main = async () => {
    await connectDb();
    eventHandler();
    const app = express();

    // !__prod__ && (await appDataSource.runMigrations());

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

    app.use("/api", userRoute);
    //after thsi middeleware all route protected;
    app.use(authenticate);
    /** routes */
    app.use("/api", meRoute);
    app.use("/api", testRoute);
    app.use("/api", fileUploadRoute);
    app.use("/api/vendor", vendorRoute);
    app.use("/api/buyer", buyerRoute);
    app.use("/api/dealer", dealerRoute);
    app.use("/api/relations", userRelationRoute);

    // not found route;
    app.use("*", (_, res) => {
        return res.send("<h1>NOT FOUND</h1>");
    });

    app.listen(process.env.PORT, () => {
        console.log("server started at port: " + process.env.PORT);
    });
};
main().catch((err) => {
    console.log("server down =>", err);
    process.exit(1);
});
