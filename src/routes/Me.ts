import { Router } from "express";
import { meController } from "../controllers";
import { authenticate } from "../middlewares/authenticate";

const meRouter = Router();
meRouter.get("/me", authenticate, meController);
export default meRouter;
