import { Request, Response } from "express";
import httpStatus from "http-status";
import { __prod__ } from "../../scripts/dev";
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
    const user = req.user;

    try {
        const buyer = await buyerOperation.repo.findOne({
            where: [{ name }, { tax_no: String(tax_no) }],
        });

        if (!buyer) {
            // create buyer;
            const buyer = await buyerOperation.insertBuyer({
                name,
                tax_no: String(tax_no),
                updated_by: user,
                created_by: user,
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
        !__prod__ && console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
