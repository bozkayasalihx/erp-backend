import { Router } from "express";
import { loginController, resetPasswordController } from "../controllers";
import registerControler from "../controllers/registerController";
import Validate from "../middlewares/validate";
import validationSchema, { ILogin, IRegister } from "../validations/validate";

// FIXME: validation and validation middlewares;

const userRoute = Router();

userRoute
    .route("/login")
    .post(
        new Validate<ILogin>().validate(validationSchema.loginValidation()),
        loginController
    );

userRoute
    .route("/register")
    .post(
        new Validate<IRegister>().validate(
            validationSchema.registerValidation()
        ),
        registerControler
    );

userRoute
    .route("/reset-password")
    .post(
        new Validate<{ email: string }>().validate(
            validationSchema.resetPasswordValidation()
        ),
        resetPasswordController
    );
export default userRoute;
