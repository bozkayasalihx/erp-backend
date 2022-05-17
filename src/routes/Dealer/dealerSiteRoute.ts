import { Router } from "express";
import { dealerSiteController } from "../../controllers";
import { IDealerSite } from "../../controllers/dealer/createDealerSite";
import Validate from "../../middlewares/validate";
import { responseFuncGen } from "../../scripts/utils/responseFuncGen";
import { dealerOperation, dealerSiteOperation } from "../../services";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

const updateDealerSite = responseFuncGen<{ name: string; dealer_id: number }>(
    dealerSiteOperation,
    async (body) => {
        const { name, dealer_id, id } = body;

        const dealer = await dealerSiteOperation.repo.findOne({
            where: { id },
        });

        if (!dealer) return dealer;

        const dealerSite = await dealerOperation.repo.findOne({
            where: { id: dealer_id },
        });

        if (!dealerSite) return dealerSite;

        dealer_id && (dealer.dealer_id = dealer_id);
        name && (dealerSite.name = name);

        return dealerSite;
    }
);

router.post(
    Routes.CREATE_DEALER_SITE,
    new Validate<IDealerSite>().validate(
        validationSchema.createDealerSiteValidation()
    ),
    dealerSiteController
);

router.patch(
    Routes.CREATE_DEALER_SITE,
    new Validate<Partial<IDealerSite>>().validate(
        validationSchema.updateDealerSiteValidation()
    ),
    updateDealerSite
);

export default router;
