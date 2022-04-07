import { Router } from "express";
import registerControler from "src/controllers/registerController";
import { validateRegister } from "../middlewares/validate";
import validations from "../validations/validate";

const route = Router();
route
    .route("/register")
    .post(
        validateRegister(validations.registerValidation()),
        registerControler
    );
export default route;
