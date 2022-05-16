import { Request, Response } from "express";
import httpStatus from "http-status";
import { buyerOperation, buyerSiteOperation } from "../../services";

export interface IBuyerSite {
    name: string;
    buyer_id: number;
}

export default async function buyerSite(
    req: Request<any, any, IBuyerSite>,
    res: Response
) {
    const { buyer_id, name } = req.body;
    const user = req.user;
    try {
        const buyerSite = await buyerSiteOperation.repo.findOne({
            where: { name },
        });

        const buyer = await buyerOperation.repo.findOne({
            where: { id: buyer_id },
        });

        if (buyer) {
            if (buyerSite) {
                buyerSite.buyer = buyer;
                buyerSite.created_by = user;
                buyerSite.updated_by = user;
                await buyerSite.save();
                return res.status(httpStatus.OK).json({
                    message: "succesfully updated",
                    data: buyerSite,
                });
            }

            const bs = await buyerSiteOperation.insertBuyerSite({
                name,
                buyer,
                updated_by: user,
                created_by: user,
            });

            return res.status(httpStatus.OK).json({
                message: "succesfully created",
                data: bs,
            });
        }

        return res.status(httpStatus.BAD_REQUEST).json({
            message: "buyer id not found",
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
