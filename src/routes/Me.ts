import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { meController } from "../controllers";

const meRouter = Router();
meRouter.get("/me", authenticate, meController);

export default meRouter;
