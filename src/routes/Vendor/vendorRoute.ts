import { Router } from "express";
import {
    createVendorController,
    createVendorRegionController,
    updateVendorController,
    updateVendorRegionController,
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
router.post(
    Routes.CREATE_VENDOR_REGION,
    new Validate<{ name: string }>().validate(
        validationSchema.createVendorRegionValidation()
    ),
    createVendorRegionController
);

router.patch(
    Routes.CREATE_VENDOR,
    new Validate<Partial<IVendor>>().validate(
        validationSchema.updateVendorValidation()
    ),
    updateVendorController
);

router.patch(
    Routes.CREATE_VENDOR_REGION,
    new Validate<{ name: string }>().validate(
        validationSchema.updateVendorRegionValidation()
    ),
    updateVendorRegionController
);

export default router;
