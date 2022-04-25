import { Router } from "express";
import { createVendor, createVendorRegion } from "../../controllers";
import { VendorBody } from "../../controllers/vendor/createVendor";
import Validate from "../../middlewares/validate";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validate";

const router = Router();

router.post(
    Routes.CREATE_VENDOR,
    new Validate<VendorBody>().validate(validationSchema.vendorValidation()),
    createVendor
);
router.post(
    Routes.CREATE_VENDOR_REGION,
    new Validate<{ name: string }>().validate(
        validationSchema.vendorRegionValidation()
    ),
    createVendorRegion
);

export default router;
