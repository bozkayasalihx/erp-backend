import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    depositOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import { Currency, DepositStatusType } from "../../types/types";

export interface IDeposit {
    amount: number;
    currency: Currency;
    status: DepositStatusType;
    approval_date: Date;
    vdsbs_id: number;
}

export default async function createDeposit(
    req: Request<any, any, IDeposit>,
    res: Response
) {
    //
    const user = req.user;
    const { amount, approval_date, currency, status, vdsbs_id } = req.body;

    try {
        const vdsbs = await vendorToDealerSiteToBuyerSiteOperation.repo.findOne(
            {
                where: { id: vdsbs_id },
            }
        );

        if (!vdsbs)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "not found",
            });

        await depositOperation.insert({
            amount,
            approval_date,
            currency,
            status,
            created_by: user,
            updated_by: user,
            vdsbs,
        });

        return res.status(httpStatus.CREATED).json({
            message: "operation successful",
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
