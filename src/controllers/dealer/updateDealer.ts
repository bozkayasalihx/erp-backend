import { Request, Response } from "express";
import httpStatus from "http-status";
import { __prod__ } from "../../scripts/dev";
import dealerOperation from "../../services/dealerOperation";
import { IDealer } from "./createDealer";

export default async function updateDealer(
    req: Request<any, any, Partial<IDealer> & { id: number }>,
    res: Response<{ message: string; data?: string }>
) {
    const { id } = req.body;

    try {
        const dealer = await dealerOperation.dealerRepo.findOne({
            where: { id },
        });

        if (!dealer)
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "not found",
            });

        if (req.body.name) dealer.name = req.body.name;
        if (req.body.tax_no) dealer.tax_no = String(req.body.tax_no);
        dealer.updated_by = req.user;
        await dealer.save();

        return res.status(httpStatus.OK).json({
            message: "successfuly updated",
        });
    } catch (err) {
        !__prod__ && console.log("err", err);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
