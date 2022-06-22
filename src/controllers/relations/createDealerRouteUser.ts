import { Request, Response } from "express";
import httpStatus from "http-status";
import { execUserEntityAccess } from "../../scripts/utils/viewFunctions";
import {
    dealerRouteUserOperation,
    userOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import { SqlConditions } from "../../types/types";

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
                message: "user not found",
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
                message: "vdsbs not found",
            });

        // getAll<typeof vdsbs.dealer_route_users[0]>(
        //     vdsbs.dealer_route_users,
        //     (routeUser) => {
        //         // router users ile tum router userlarina erisebilirsin;
        //         // buradan gerlikli validasyonlari yaparsin sen artik;
        //         // routeUser.
        //     }
        // );

        //const vConditions:SqlConditions = {};
        // date fields should be string type if passed in vConditions
        const vConditions: SqlConditions = {
            user_id: user_id,
        };
        const vdsbsIds = await execUserEntityAccess(vConditions, false);

        if (!vdsbsIds) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "user_id data has no relation",
            });
        } else {
            // check whether user_id-vdsbs_id relation exists on system
            let relationFound = false;
            for (let i = 0; i < vdsbsIds.length; i++) {
                if (vdsbsIds[i].vdsbs_id === vdsbs_id) {
                    relationFound = true;
                    break;
                }
            }
            if (!relationFound) {
                return res.status(httpStatus.NOT_FOUND).json({
                    message: "user_id data entity relation must setup first",
                });
            }
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
