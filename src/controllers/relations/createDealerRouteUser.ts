import { Request, Response } from "express";
import httpStatus from "http-status";
import { appDataSource } from "../../loaders";
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

        // getAll<typeof vdsbs.dealer_route_users[0]>(
        //     vdsbs.dealer_route_users,
        //     (routeUser) => {
        //         // router users ile tum router userlarina erisebilirsin;
        //         // buradan gerlikli validasyonlari yaparsin sen artik;
        //         // routeUser.
        //     }
        // );

        const vdsbsIds = await appDataSource.query(
            "select vdsbs_id, from user_entity_relations_v where user_id"
        );

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
        console.log("err", err);
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
