import { Router } from "express";
import registerControler from "../controllers/registerController";
import { validateRegister } from "../controllers/registerController";
import validations from "../validations/validate";

const route = Router();
route
    .route("/register")
    .post(
        validateRegister(validations.registerValidation()),
        registerControler
    );
export default route;
