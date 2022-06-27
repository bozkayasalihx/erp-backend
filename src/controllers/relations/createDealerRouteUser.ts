import httpStatus from "http-status";
import { execUserEntityAccess } from "../../scripts/utils/viewFunctions";
import {
    dealerRouteUserOperation,
    userOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import { SqlConditions, TypedRequest, TypedResponse } from "../../types";

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

        // getAll<typeof vdsbs.dealer_route_users[0]>(
        //     vdsbs.dealer_route_users,
        //     (routeUser) => {
        //         // router users ile tum router userlarina erisebilirsin;
        //         // buradan gerlikli validasyonlari yaparsin sen artik;
        //         // routeUser.
        //     }
        // );

        // const vConditions:SqlConditions = {};
        // date fields should be string type if passed in vConditions
        const vConditions: SqlConditions = {
            userId,
        };
        const vdsbsIds = await execUserEntityAccess(vConditions, false);

        if (!vdsbsIds) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "user_id data has no relation",
            });
        }
        // check whether user_id-vdsbs_id relation exists on system
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
