import { Router } from "express";
import { dealerController, dealerSiteController } from "../../controllers";
import { IDealer } from "../../controllers/dealer/dealer";
import { IDealerSite } from "../../controllers/dealer/dealerSite";
import Validate from "../../middlewares/validate";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.CREATE_DEALER,
    new Validate<IDealer>().validate(validationSchema.dealerValidation()),
    dealerController
);
router.post(
    Routes.CREATE_DEALER_SITE,
    new Validate<IDealerSite>().validate(
        validationSchema.dealerSiteValidation()
    ),
    dealerSiteController
);

export default router;
