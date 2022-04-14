import { Router } from "express";
import { testControler } from "../../controllers";

const router = Router();

router.route("/test").get(testControler);

export default router;
