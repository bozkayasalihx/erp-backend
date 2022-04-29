import { Router } from "express";
import { buyerControler, buyerSiteController } from "../../controllers";
import { IBuyerParams } from "../../controllers/buyer/createBuyer";
import { IBuyerSite } from "../../controllers/buyer/createBuyerSite";
import Validate from "../../middlewares/validate";
import { responseFuncGen } from "../../scripts/utils/responseFuncGen";
import { buyerOperation } from "../../services";
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
    Routes.CREATE_BUYER_SITE,
    new Validate<IBuyerSite>().validate(
        validationSchema.createBuyerSiteValidation()
    ),
    buyerSiteController
);

router.patch(
    Routes.CREATE_BUYER,
    new Validate<Partial<IBuyerParams>>().validate(
        validationSchema.updateBuyerValidation()
    ),
    responseFuncGen<IBuyerParams, any>(buyerOperation)
);
router.patch(
    Routes.CREATE_BUYER_SITE,
    new Validate<Partial<IBuyerSite>>().validate(
        validationSchema.updateBuyerSiteValidation()
    ),
    responseFuncGen<IBuyerSite, any>(buyerOperation)
);

export default router;
