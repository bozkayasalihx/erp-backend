import { Router } from "express";
import {
    createVendorRegionController,
    updateVendorRegionController,
} from "../../controllers";
import Validate from "../../middlewares/validate";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.CREATE_VENDOR_REGION,
    new Validate<{ name: string }>().validate(
        validationSchema.createVendorRegionValidation()
    ),
    createVendorRegionController
);

router.patch(
    Routes.CREATE_VENDOR_REGION,
    new Validate<{ name: string }>().validate(
        validationSchema.updateVendorRegionValidation()
    ),
    updateVendorRegionController
);
export default router;
