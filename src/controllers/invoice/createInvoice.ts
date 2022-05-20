import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    invoiceOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import { Currency, InvoiceStatusType } from "../../types/types";

export interface IInvoice {
    invoice_no: string;
    invoice_date: Date;
    invoice_amount: number;
    currency: Currency;
    status: InvoiceStatusType;
    ref_file_id: number;
    attribute1?: string;
    attribute2?: string;
    attribute3?: string;
    attribute4?: string;
    attribute5?: string;
    due_date: Date;
    vdsbs_id: number;
}

export default async function createInvoice(
    req: Request<any, any, IInvoice>,
    res: Response
) {
    //

    const user = req.user;
    const params = req.body;

    try {
        const vdsbs = await vendorToDealerSiteToBuyerSiteOperation.repo.findOne(
            {
                where: { id: params.vdsbs_id },
            }
        );

        if (!vdsbs)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "not found",
            });

        await invoiceOperation.createInvoice({
            ...params,
            created_by: user,
            updated_by: user,
            vdsbs,
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
