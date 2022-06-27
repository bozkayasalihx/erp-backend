import { Request, Response } from "express";
import httpStatus from "http-status";
import { paymentOperation } from "../../services";
import VendorTDealerSiteTBuyerSiteOperation from "../../services/VendorTDealerSiteTBuyerSiteOperation";
import { Currency, InvoiceStatusType, PaymentType } from "../../types";

export interface IPaymentSchedule {
    paymentType?: PaymentType;
    referenceId: number;
    vdsbsId: number;
    originalAmount: number;
    remainedAmount: number;
    currency?: Currency;
    effectiveDate: Date;
    invoicedStatus?: InvoiceStatusType;
}

type TypedRequest = Request<any, any, IPaymentSchedule>;
export default async function createPayment(req: TypedRequest, res: Response) {
    const { user } = req;
    const {
        currency,
        effectiveDate,
        invoicedStatus,
        originalAmount,
        paymentType,
        referenceId,
        remainedAmount,
        vdsbsId,
    } = req.body;

    try {
        const vdsbs = await VendorTDealerSiteTBuyerSiteOperation.repo.findOne({
            where: { id: vdsbsId },
        });
        if (!vdsbs) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "not found",
            });
        }

        await paymentOperation.createPayment({
            currency,
            effectiveDate,
            invoicedStatus,
            originalAmount,
            paymentType,
            referenceId,
            remainedAmount,
            created_by: user,
            updated_by: user,
        });
        return res.status(httpStatus.CREATED).json({
            message: "operation succesful",
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
