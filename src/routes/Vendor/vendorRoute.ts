import { Router } from "express";
import {
    createVendorController,
    getVendorController,
    updateVendorController,
} from "../../controllers";
import { IVendor } from "../../controllers/vendor/createVendor";
import Validate from "../../middlewares/validate";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.CREATE_VENDOR,
    new Validate<IVendor>().validate(validationSchema.createVendorValidation()),
    createVendorController
);

router.get("/:vendorId?", getVendorController);

router.patch(
    Routes.CREATE_VENDOR,
    new Validate<Partial<IVendor>>().validate(
        validationSchema.updateVendorValidation()
    ),
    updateVendorController
);

export default router;
