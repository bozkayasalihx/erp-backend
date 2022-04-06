import { Router } from "express";
import { loginController } from "../controllers";

//FIXME: validation and validation middlewares;

const loginRouter = Router();

loginRouter.post("/login", loginController);
export default loginRouter;
