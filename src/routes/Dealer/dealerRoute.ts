import { Router } from "express";
import { dealerController } from "../../controllers";
import { IDealer } from "../../controllers/dealer/createDealer";
import Validate from "../../middlewares/validate";
import { responseFuncGen } from "../../scripts/utils/responseFuncGen";
import { dealerOperation } from "../../services";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

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

router.patch(
    Routes.CREATE_DEALER,
    new Validate<Partial<IDealer>>().validate(
        validationSchema.updateDealerValidation()
    ),
    updateDealer
);

export default router;
