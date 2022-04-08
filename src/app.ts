import "dotenv/config";
import express from "express";
import helmet from "helmet";
import "reflect-metadata";
import { connectDb } from "./loaders/database";
import { meRoute, userRoute } from "./routes";
import { event } from "./configs";

const main = async () => {
    await connectDb();
    event();
    const app = express();
    app.use(express.json());
    app.use(helmet());
    // await appDataSource.dropDatabase().then(() => console.log("done"))

    app.use("/api", userRoute);
    app.use("/api", meRoute);
    app.listen(process.env.PORT, () => {
        console.log("server started at port: " + process.env.PORT);
    });
};
main().catch(err => {
    console.log("server down", err);
    process.exit(1);
});
