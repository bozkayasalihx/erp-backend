import { Router } from "express";
import { meController } from "../../controllers";
import { authenticate } from "../../middlewares";
import { Routes } from "../../types/routePath";

const meRouter = Router();

meRouter.get(Routes.ME, authenticate, meController);
export default meRouter;
