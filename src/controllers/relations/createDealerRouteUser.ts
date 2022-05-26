import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    dealerRouteUserOperation,
    userOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";

export interface IDealerRouteUser {
    vdsbs_id: number;
    user_id: number;
    description?: string;
}

export default async function dealerRouteUser(
    req: Request<any, any, IDealerRouteUser>,
    res: Response
) {
    const user = req.user;
    const { user_id, vdsbs_id, description } = req.body;

    try {
        const findedUser = await userOperation.repo.findOne({
            where: { id: user_id },
        });

        if (!findedUser) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "not found",
            });
        }

        const vdsbs = await vendorToDealerSiteToBuyerSiteOperation.repo.findOne(
            {
                where: { id: vdsbs_id },
            }
        );

        if (!vdsbs)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "not found",
            });

        await dealerRouteUserOperation.insertUE({
            vdsbs,
            created_by: user,
            updated_by: user,
            description,
            user: findedUser,
        });

        return res.status(httpStatus.CREATED).json({
            message: "operation successful",
        });
    } catch (err) {
        if (err?.detail?.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "already exists",
            });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
