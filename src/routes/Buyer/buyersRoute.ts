import { Router } from "express";
import { buyerControler } from "../../controllers";
import { IBuyerParams } from "../../controllers/buyer/createBuyer";
import Validate from "../../middlewares/validate";
import { responseFuncGen } from "../../scripts/utils/responseFuncGen";
import { buyerOperation } from "../../services";
import { Routes } from "../../types/routePath";
import validationSchema from "../../validations/validationSchema";

const router = Router();

const updatedBuyer = responseFuncGen<{ name: string; tax_no: number }>(
    buyerOperation,
    async (body) => {
        const { id, name, tax_no } = body;
        const buyer = await buyerOperation.repo.findOne({
            where: { id },
        });

        if (name && buyer) buyer.name = name;
        if (tax_no && buyer) buyer.tax_no = String(tax_no);
        return buyer;
    }
);

router.post(
    Routes.CREATE_BUYER,
    new Validate<IBuyerParams>().validate(
        validationSchema.createBuyerValidation()
    ),
    buyerControler
);

router.patch(
    Routes.CREATE_BUYER,
    new Validate<Partial<IBuyerParams>>().validate(
        validationSchema.updateBuyerValidation()
    ),
    updatedBuyer
);
export default router;
