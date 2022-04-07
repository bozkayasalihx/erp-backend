import { Router } from "express";
import { validate } from "../middlewares/validate.middle";
import { meController } from "../controllers";

const meRouter = Router();
meRouter.get("/me", validate, meController);

export default meRouter;
