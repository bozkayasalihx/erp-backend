import { Router } from "express";
import { validate } from "../middlewares/validate";
import { loginController } from "../controllers";
import validations from "../validations/validate";

//FIXME: validation and validation middlewares;

const loginRouter = Router();

loginRouter
    .route("/login")
    .post(validate(validations.loginValidation()), loginController);
export default loginRouter;
