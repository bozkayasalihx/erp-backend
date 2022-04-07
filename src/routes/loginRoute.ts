import { Router } from "express";
import { validateLogin } from "../middlewares/validate";
import { loginController } from "../controllers";
import validations from "../validations/validate";

//FIXME: validation and validation middlewares;

const loginRouter = Router();

loginRouter
    .route("/login")
    .post(validateLogin(validations.loginValidation()), loginController);
export default loginRouter;
