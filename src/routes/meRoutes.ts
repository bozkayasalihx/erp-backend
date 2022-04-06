import { Router } from "express";
import { meController } from "../controllers";

const meRouter = Router();
meRouter.get("/me", meController);

export default meRouter;
