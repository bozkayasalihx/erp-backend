import { Router } from "express";
import registerControler from "../controllers/registerController";
import { validate } from "../middlewares/validate";
import validations from "../validations/validate";

const route = Router();
route
    .route("/register")
    .post(validate(validations.registerValidation()), registerControler);
export default route;
