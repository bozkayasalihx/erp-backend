import { Request, Response } from "express";
import httpStatus from "http-status";
import dealerOperation from "../../services/dealerOperation";
import { AttributeFields, OptionalDates } from "../../types/types";

export interface IDealer extends AttributeFields, OptionalDates {
    name: string;
    tax_no: number;
}

export default async function dealer(
    req: Request<any, any, IDealer>,
    res: Response
) {
    const { name, tax_no, ...attributes } = req.body;
    const user = req.user;
    try {
        await dealerOperation.insertDealer({
            name,
            tax_no: String(tax_no),
            ...attributes,
            updated_by: user,
            created_by: user,
        });

        return res.status(httpStatus.OK).json({
            message: "successfully created",
        });
    } catch (err) {
        if (err?.detail?.includes("already exists")) {
            // already exits error;
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "this record already exits",
            });
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
