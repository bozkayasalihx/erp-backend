import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    advanceOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import { AdvanceStatusType, AdvanceType, Currency } from "../../types/types";

export interface IAdvance {
    advance_type: AdvanceType;
    amount: number;
    currency: Currency;
    vdsbs_id: number;
    status: AdvanceStatusType;
    approvalDate?: Date;
}

export default async function createAdvance(
    req: Request<any, any, IAdvance>,
    res: Response
) {
    const { advance_type, amount, approvalDate, currency, status, vdsbs_id } =
        req.body;
    const user = req.user;
    try {
        const vdsbs = await vendorToDealerSiteToBuyerSiteOperation.repo.findOne(
            {
                where: { id: vdsbs_id },
            }
        );

        if (!vdsbs)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "no found",
            });

        await advanceOperation.createAdvance({
            advance_type,
            amount,
            approval_date: approvalDate,
            currency,
            status,
            vdsbs,
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
