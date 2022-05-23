import { Router } from "express";
import { createPaymentController } from "../../controllers";
import { IPaymentSchedule } from "../../controllers/payment/createPayment";
import { Validate } from "../../middlewares";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.CREATE_PAYMENT_SCHEDULE,
    new Validate<IPaymentSchedule>().validate(
        validationSchema.createPaymentSchedule()
    ),
    createPaymentController
);

export default router;
