import { Router } from "express";
import { meController } from "../../controllers";
import { isSetCookie } from "../../middlewares/isSetCookie";
import { Routes } from "../../types/routePath";

const meRouter = Router();
meRouter.get(Routes.ME, isSetCookie, meController);
export default meRouter;
