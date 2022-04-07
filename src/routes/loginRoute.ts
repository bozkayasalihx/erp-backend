import { Router } from "express";
import { loginController } from "../controllers";
import { validate } from "../middlewares/validate";
import validatioinSchema from "../validations/validate";

//FIXME: validation and validation middlewares;

const loginRouter = Router();

loginRouter
    .route("/login")
    .post(validate(validatioinSchema.loginValidation()), loginController);
export default loginRouter;
