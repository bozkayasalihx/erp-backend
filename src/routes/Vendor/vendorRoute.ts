import { Router } from "express";
import {
    createVendorController,
    createVendorRegionController,
} from "../../controllers";
import { VendorBody } from "../../controllers/vendor/createVendor";
import Validate from "../../middlewares/validate";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.CREATE_VENDOR,
    new Validate<VendorBody>().validate(
        validationSchema.createVendorValidation()
    ),
    createVendorController
);
router.post(
    Routes.CREATE_VENDOR_REGION,
    new Validate<{ name: string }>().validate(
        validationSchema.createVendorRegionValidation()
    ),
    createVendorRegionController
);

export default router;
