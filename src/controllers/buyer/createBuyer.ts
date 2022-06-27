import { Request, Response } from "express";
import httpStatus from "http-status";
import { buyerOperation } from "../../services";
import { AttributeFields, OptionalDates } from "../../types";

export interface IBuyer extends AttributeFields, OptionalDates {
    name: string;
    taxNo: number;
}

export default async function buyer(
    req: Request<any, any, IBuyer>,
    res: Response
) {
    const { name, taxNo, ...attributes } = req.body;
    const { user } = req;

    try {
        const buyerUser = await buyerOperation.repo.findOne({
            where: [{ name }, { taxNo: String(taxNo) }],
        });

        if (!buyerUser) {
            // create buyer;
            const insertedBuyer = await buyerOperation.insertBuyer({
                name,
                taxNo: String(taxNo),
                ...attributes,
                updated_by: user,
                created_by: user,
            });

            return res.status(httpStatus.OK).json({
                message: "successfully created",
                data: insertedBuyer,
            });
        }

        return res.status(httpStatus.BAD_REQUEST).json({
            message: "already exists",
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
