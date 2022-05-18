import { Router } from "express";
import { createDeposit } from "../../controllers";
import { IDeposit } from "../../controllers/deposit/createDeposit";
import { Validate } from "../../middlewares";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();
const validateMiddle = new Validate<IDeposit>().validate;

router.post(
    Routes.CREATE_DEPOSIT,
    validateMiddle(validationSchema.createDeposit()),
    createDeposit
);

export default router;
