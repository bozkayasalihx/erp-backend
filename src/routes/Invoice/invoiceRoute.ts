import { Router } from "express";
import { createInvoiceController } from "../../controllers";
import { IInvoice } from "../../controllers/invoice/createInvoice";
import { Validate } from "../../middlewares";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.CREATE_INVOICE,
    new Validate<IInvoice>().validate(validationSchema.createInvoice()),
    createInvoiceController
);

export default router;
