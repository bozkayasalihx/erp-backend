import { Router } from "express";
import {
    forgotPasswordController,
    loginController,
    logoutController,
    refreshTokenController,
    resetPasswordController,
} from "../../controllers";
import registerControler from "../../controllers/user/registerController";
import { isSetCookie } from "../../middlewares";
import Validate from "../../middlewares/validate";
import { Routes } from "../../types/routePath";
import validationSchema, {
    ILogin,
    IRegister,
} from "../../validations/validationSchema";

const userRoute = Router();

userRoute
    .route(Routes.LOGIN)
    .post(
        new Validate<ILogin>().validate(validationSchema.loginValidation()),
        loginController
    );

userRoute
    .route(Routes.REGISTER)
    .post(
        new Validate<IRegister>().validate(
            validationSchema.registerValidation()
        ),
        registerControler
    );

userRoute
    .route(Routes.FORGOT_PASSWORD)
    .post(
        new Validate<{ email: string }>().validate(
            validationSchema.resetPasswordValidation()
        ),
        forgotPasswordController
    );

userRoute.post("/logout", logoutController);
userRoute.post(
    Routes.RESET_PASSWORD,
    new Validate().validate(validationSchema.createPasswordValidation()),
    resetPasswordController
);
userRoute.route(Routes.REFRESH_TOKEN).get(isSetCookie, refreshTokenController);
export default userRoute;
