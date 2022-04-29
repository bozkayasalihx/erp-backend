import { Router } from "express";
import {
    dealerController,
    dealerSiteController,
    updateDealerController,
    updateDealerSiteController,
} from "../../controllers";
import { IDealer } from "../../controllers/dealer/createDealer";
import { IDealerSite } from "../../controllers/dealer/createDealerSite";
import Validate from "../../middlewares/validate";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

router.post(
    Routes.CREATE_DEALER,
    new Validate<IDealer>().validate(validationSchema.createDealerValidation()),
    dealerController
);
router.post(
    Routes.CREATE_DEALER_SITE,
    new Validate<IDealerSite>().validate(
        validationSchema.createDealerSiteValidation()
    ),
    dealerSiteController
);

router.patch(
    Routes.CREATE_DEALER,
    new Validate<Partial<IDealer>>().validate(
        validationSchema.updateDealerValidation()
    ),
    updateDealerController
);

router.patch(
    Routes.CREATE_DEALER_SITE,
    new Validate<Partial<IDealerSite>>().validate(
        validationSchema.updateDealerSiteValidation()
    ),
    updateDealerSiteController
);

export default router;
