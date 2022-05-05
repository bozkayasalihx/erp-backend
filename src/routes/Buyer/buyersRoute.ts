import { Router } from "express";
import { buyerControler, buyerSiteController } from "../../controllers";
import { IBuyerParams } from "../../controllers/buyer/createBuyer";
import { IBuyerSite } from "../../controllers/buyer/createBuyerSite";
import Validate from "../../middlewares/validate";
import { responseFuncGen } from "../../scripts/utils/responseFuncGen";
import { buyerSiteOperation } from "../../services";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

const updateBuyerSite = responseFuncGen<{ name: string; tax_no: number }>(
    buyerSiteOperation,
    async (body) => {
        const { id, name, tax_no } = body;
        const buyerSite = await buyerSiteOperation.repo.findOne({
            where: { id },
        });

        if (name && buyerSite) buyerSite.name = name;
        return buyerSite;
    }
);
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
    )
);
router.patch(
    Routes.CREATE_BUYER_SITE,
    new Validate<Partial<IBuyerSite>>().validate(
        validationSchema.updateBuyerSiteValidation()
    ),
    updateBuyerSite
);

export default router;
