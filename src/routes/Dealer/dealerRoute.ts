import { Router } from "express";
import { dealerController, dealerSiteController } from "../../controllers";
import { IDealer } from "../../controllers/dealer/createDealer";
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

const updateDealer = responseFuncGen<{ name: string; tax_no: number }>(
    dealerOperation,
    async (body) => {
        const { name, tax_no, id } = body;

        const dealer = await dealerOperation.repo.findOne({
            where: { id },
        });

        if (!dealer) return dealer;

        if (tax_no) dealer.tax_no = String(tax_no);
        if (name) dealer.name = name;

        return dealer;
    }
);

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
    updateDealer
);

router.patch(
    Routes.CREATE_DEALER_SITE,
    new Validate<Partial<IDealerSite>>().validate(
        validationSchema.updateDealerSiteValidation()
    ),
    updateDealerSite
);

export default router;
