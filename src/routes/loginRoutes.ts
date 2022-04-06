import { Router } from "express";
import { loginController } from "../controllers";
import expressJwt from "express-jwt";

const loginRouter = Router();

loginRouter.post("/login", loginController);
export default loginRouter;
