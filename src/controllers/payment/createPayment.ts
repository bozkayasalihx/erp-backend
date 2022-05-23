import { Request, Response } from "express";
import httpStatus from "http-status";
import { paymentOperation } from "../../services";
import VendorTDealerSiteTBuyerSiteOperation from "../../services/VendorTDealerSiteTBuyerSiteOperation";
import { Currency, InvoiceStatusType, PaymentType } from "../../types/types";

export interface IPaymentSchedule {
    payment_type?: PaymentType;
    reference_id: number;
    vdsbs_id: number;
    original_amount: number;
    remained_amount: number;
    currency?: Currency;
    effective_date: Date;
    invoiced_status?: InvoiceStatusType;
}

type TypedRequest = Request<any, any, IPaymentSchedule>;
export default async function createPayment(req: TypedRequest, res: Response) {
    const user = req.user;
    const {
        currency,
        effective_date,
        invoiced_status,
        original_amount,
        payment_type,
        reference_id,
        remained_amount,
        vdsbs_id,
    } = req.body;

    try {
        const vdsbs = await VendorTDealerSiteTBuyerSiteOperation.repo.findOne({
            where: { id: vdsbs_id },
        });
        if (!vdsbs)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "not found",
            });

        await paymentOperation.createPayment({
            currency,
            effective_date,
            invoiced_status,
            original_amount,
            payment_type,
            reference_id,
            remained_amount,
            created_by: user,
            updated_by: user,
        });
        return res.status(httpStatus.CREATED).json({
            message: "operation succesful",
        });
    } catch (err) {
        console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
