import dotenv from "dotenv";
import path from "path";
import { __prod__ } from "../scripts/dev";

(function () {
    dotenv.config({
        path: !__prod__
            ? path.resolve("../../.env.test")
            : path.resolve("../../.env"),
    });
})();
