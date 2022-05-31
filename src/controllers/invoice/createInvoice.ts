import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    invoiceOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import {
    AttributeFields,
    Currency,
    InvoiceStatusType,
} from "../../types/types";

export interface IInvoice extends AttributeFields {
    invoice_no: string;
    invoice_date: Date;
    amount: number;
    currency: Currency;
    status: InvoiceStatusType;
    ref_file_id: number;
    due_date: Date;
    vdsbs_id: number;
}

type TypedRequest = Request<any, any, IInvoice>;

export default async function createInvoice(req: TypedRequest, res: Response) {
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
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
