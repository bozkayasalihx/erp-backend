import { Router } from "express";
import { buyerControler, buyerSiteController } from "../../controllers";
import { IBuyerParams } from "../../controllers/buyer/buyer";
import { IBuyerSite } from "../../controllers/buyer/buyerSite";
import Validate from "../../middlewares/validate";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.CREATE_BUYER,
    new Validate<IBuyerParams>().validate(
        validationSchema.createBuyerValidation()
    ),
    buyerControler
);
router.post(
    Routes.CREATE_VENDOR_REGION,
    new Validate<IBuyerSite>().validate(
        validationSchema.createBuyerSiteValidation()
    ),
    buyerSiteController
);

export default router;
