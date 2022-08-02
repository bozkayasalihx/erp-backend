import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import httpStatus from "http-status";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { eventHandler } from "./configs";
import { config } from "./loaders";
import "./loaders/envLoader";
import { authenticate, permission } from "./middlewares";
import {
    advanceRoute,
    buyerRoute,
    BuyerSiteRoute,
    dealerRoute,
    DealerSiteRoute,
    depositRoute,
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
import { __prod__ } from "./scripts/dev";

export const main = async () => {
    await config();
    eventHandler();
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
    !__prod__ && app.use(morgan("dev"));

    app.use("/static", express.static(path.join(__dirname, "../src/public")));

    app.use("/api", userRoute);
    // after this middeleware all route protected;
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
    app.use("/api/payment", paymentRoute);
    // not found route;
    app.use("*", (_, res) =>
        res.status(httpStatus.FORBIDDEN).send("<h1>NOT FOUND</h1>")
    );

    app.listen(process.env.SERVER_PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`server started at port: ${process.env.SERVER_PORT}`);
    });
};
process.on("unhandledRejection", (reason, promise) => {
    // eslint-disable-next-line no-console
    console.log("rejections reason", reason, promise);
});
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.log("server down => \n", err);
    process.exit(1);
});
