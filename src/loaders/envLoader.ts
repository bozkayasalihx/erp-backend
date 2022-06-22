import dotenv from "dotenv";
import { __prod__ } from "../scripts/dev";
import path from "path";

(function () {
    dotenv.config({
        path: !__prod__
            ? path.resolve("../../.env.test")
            : path.resolve("../../.env"),
    });
})();
