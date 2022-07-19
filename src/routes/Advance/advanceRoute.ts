import { Router } from "express";
import { createAdvanceController } from "../../controllers";
import { IAdvance } from "../../controllers/advance/createAdvance";
import { Validate } from "../../middlewares";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();
router.post(
    Routes.CREATE_ADVANCE,
    new Validate<IAdvance>().validate(validationSchema.createAdvance()),
    createAdvanceController
);

export default router;
