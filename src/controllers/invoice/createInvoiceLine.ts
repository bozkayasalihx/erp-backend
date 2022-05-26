import { Request, Response } from "express";
import httpStatus from "http-status";
import { invoiceOperation } from "../../services";
import { Currency } from "../../types/types";

export interface IInvoiceLine {
    invoice_id: number;
    line_no: number;
    amount: number;
    currency: Currency;
    item_quantity: number;
    item_uom: string;
    item_description?: string;
}

type TypedRequest = Request<any, any, IInvoiceLine>;
export default async function createInvoiceLine(
    req: TypedRequest,
    res: Response
) {
    const {
        amount,
        currency,
        invoice_id,
        item_quantity,
        item_uom,
        line_no,
        item_description,
    } = req.body;

    const user = req.user;

    try {
        const invoice = await invoiceOperation.invoiceRepo.findOne({
            where: { id: invoice_id },
        });

        if (!invoice)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "not found",
            });

        await invoiceOperation.createInvoiceLine({
            amount,
            currency,
            invoice,
            item_description,
            line_no,
            item_uom,
            item_quantity,
            created_by: user,
            updated_by: user,
        });
        return res.status(httpStatus.CREATED).json({
            message: "operation succesful",
        });
    } catch (err) {
        console.log("err");
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
