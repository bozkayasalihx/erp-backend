import { Request, Response } from "express";
import httpStatus from "http-status";
import { buyerOperation } from "../../services";

export interface IBuyerParams {
    name: string;
    tax_no: number;
}

export default async function buyer(
    req: Request<any, any, IBuyerParams>,
    res: Response
) {
    const { name, tax_no } = req.body;

    try {
        const buyer = await buyerOperation.buyerRepo.findOne({
            where: [{ name }, { tax_no: String(tax_no) }],
        });

        if (!buyer) {
            // create buyer;
            const buyer = await buyerOperation.insertBuyer({
                name,
                tax_no: String(tax_no),
            });

            return res.status(httpStatus.OK).json({
                message: "successfully created",
                data: buyer,
            });
        }

        return res.status(httpStatus.BAD_REQUEST).json({
            message: "already exists",
        });
    } catch (err) {
        console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
