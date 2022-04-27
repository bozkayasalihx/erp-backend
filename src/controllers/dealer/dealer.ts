import { Request, Response } from "express";
import httpStatus from "http-status";
import dealerOperation from "../../services/dealerOperation";

export interface IDealer {
    name: string;
    tax_no: number;
}

export default async function dealer(
    req: Request<any, any, IDealer>,
    res: Response
) {
    const { name, tax_no } = req.body;

    try {
        await dealerOperation.insertDealer({
            name,
            tax_no: String(tax_no),
        });

        return res.status(httpStatus.OK).json({
            message: "successfully created",
        });
    } catch (err) {
        console.log("erro", err);
        if (err.detail.includes("already exists")) {
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
