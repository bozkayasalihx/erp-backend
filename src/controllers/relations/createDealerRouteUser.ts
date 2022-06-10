import { Request, Response } from "express";
import httpStatus from "http-status";
import { getAllVdsbs } from "../../scripts/utils/getAllVsdbs";
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
                relations: {
                    dealer_route_users: true,
                },
            }
        );

        if (!vdsbs)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "not found",
            });

        const vdsbsIds = await getAllVdsbs(user_id);
        console.log("vdsbs ids", vdsbsIds);
        if (!vdsbsIds)
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "already exists",
            });

        const valid = vdsbsIds.indexOf(vdsbs_id) !== -1 ? true : false;

        if (!valid)
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "not in dealer user",
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
