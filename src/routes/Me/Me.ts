import { Router } from "express";
import { meController } from "../../controllers";
import { Routes } from "../../types/routePath";

const meRouter = Router();
meRouter.get(Routes.ME, meController);
export default meRouter;
