import { Router } from "express";
import {
    createInvoceLineController,
    createInvoiceController,
} from "../../controllers";
import { IInvoice } from "../../controllers/invoice/createInvoice";
import { IInvoiceLine } from "../../controllers/invoice/createInvoiceLine";
import { Validate } from "../../middlewares";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.CREATE_INVOICE,
    new Validate<IInvoice>().validate(validationSchema.createInvoice()),
    createInvoiceController
);
router.post(
    Routes.CREATE_INVOICE_LINE,
    new Validate<IInvoiceLine>().validate(validationSchema.createInvoiceLine()),
    createInvoceLineController
);

export default router;
