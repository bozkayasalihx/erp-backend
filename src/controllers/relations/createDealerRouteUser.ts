import httpStatus from "http-status";
import {
    dealerRouteUserOperation,
    userOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import { TypedRequest, TypedResponse } from "../../types";

export interface IDealerRouteUser {
    vdsbsId: number;
    userId: number;
    description?: string;
}

export default async function dealerRouteUser(
    req: TypedRequest<IDealerRouteUser>,
    res: TypedResponse
) {
    const { user } = req;
    const { userId, vdsbsId, description } = req.body;

    try {
        const findedUser = await userOperation.repo.findOne({
            where: { id: userId },
        });

        if (!findedUser) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "user not found",
            });
        }

        const vdsbs = await vendorToDealerSiteToBuyerSiteOperation.repo.findOne(
            {
                where: { id: vdsbsId },
                relations: {
                    dealerRouteUsers: true,
                },
            }
        );

        if (!vdsbs) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "vdsbs not found",
            });
        }

        const vdsbsIds = [{ vdsbs_id: 1 }];

        if (!vdsbsIds) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "user_id data has no relation",
            });
        }

        let relationFound = false;
        for (let i = 0; i < vdsbsIds.length; i++) {
            if (vdsbsIds[i].vdsbs_id === vdsbsId) {
                relationFound = true;
                break;
            }
        }
        if (!relationFound) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "user_id data entity relation must setup first",
            });
        }

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
