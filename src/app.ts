import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import "reflect-metadata";
import { appDataSource } from "./bootstrap";
import isLoggedIn from "./middleware/isLoggedIn";
import { loginRouter, meRoutes } from "./routes";
import expressJwt from "express-jwt";
import path from "path";

const RedisStore = connectRedis(session);
const redis = new Redis(process.env.REDIS_URL as string);

const main = async () => {
    await appDataSource.initialize();
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    // app.set("trust proxy", 1);
    // app.use(
    //     session({
    //         store: new RedisStore({
    //             client: redis,
    //             disableTouch: true,
    //             disableTTL: true,
    //         }),
    //         secret: process.env.SESSION_SECRET!,
    //         resave: false,
    //         name: "qid",
    //         saveUninitialized: true,
    //         cookie: {
    //             secure: __prod__,
    //             maxAge: +process.env.SESSION_MAX_AGE!,
    //             sameSite: "lax",
    //             httpOnly: true,
    //         },
    //     })
    // );

    // /**
    //  * all routes handeld in here;
    //  */

    app.use(
        expressJwt({
            secret: process.env.SESSION_SECRET as string,
            algorithms: ["HS256"],
        }).unless({ path: ["/api/login"] })
    );

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
