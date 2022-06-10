import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import httpStatus from "http-status";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { eventHandler } from "./configs";
import { appDataSource, config } from "./loaders";
import { authenticate, permission } from "./middlewares";
import { migrations1654676053160 } from "./migrations/1654676053160-migrations";
import {
    advanceRoute,
    buyerRoute,
    BuyerSiteRoute,
    dealerRoute,
    DealerSiteRoute,
    depositRoute,
    invoiceRoute,
    meRoute,
    paymentRoute,
    PSIUploadProcess,
    relationRoute,
    testRoute,
    userRoute,
    VendorRegionRoute,
    vendorRoute,
    VIUploadProcess,
} from "./routes";

export const main = async () => {
    await config();
    eventHandler();
    const app = express();
    const runner = async () => {
        const migration = new migrations1654676053160();
        await migration.up(appDataSource.createQueryRunner());
    };
    // await runner();

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
    //after this middeleware all route protected;
    app.use(authenticate);
    app.use(permission);
    /** routes */
    app.use("/api", meRoute);
    app.use("/api", testRoute);
    app.use("/api", PSIUploadProcess);
    app.use("/api", VIUploadProcess);
    app.use("/api/vendor", vendorRoute);
    app.use("/api/vendor-region", VendorRegionRoute);
    app.use("/api/buyer", buyerRoute);
    app.use("/api/buyer-site", BuyerSiteRoute);
    app.use("/api/dealer", dealerRoute);
    app.use("/api/dealer-site", DealerSiteRoute);
    app.use("/api/relations", relationRoute);
    app.use("/api/deposit", depositRoute);
    app.use("/api/advance", advanceRoute);
    app.use("/api/invoice", invoiceRoute);
    app.use("/api/payment", paymentRoute);
    // not found route;
    app.use("*", (_, res) => {
        return res.status(httpStatus.FORBIDDEN).send("<h1>NOT FOUND</h1>");
    });

    app.listen(process.env.PORT, () => {
        console.log("server started at port: " + process.env.PORT);
    });
};
process.on("unhandledRejection", (reason, promise) => {
    console.log("rejections reason", reason, promise);
});
main().catch((err) => {
    console.log("server down =>", err);
    process.exit(1);
});
