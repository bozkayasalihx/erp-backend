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
    try {
        const buyerSite = await buyerSiteOperation.buyerSiteRepo.findOne({
            where: { name },
        });

        const buyer = await buyerOperation.buyerRepo.findOne({
            where: { id: buyer_id },
        });

        if (buyer) {
            if (buyerSite) {
                buyerSite.buyer = buyer;
                await buyerSite.save();

                return res.status(httpStatus.OK).json({
                    message: "succesfully updated",
                    data: buyerSite,
                });
            }

            const bs = await buyerSiteOperation.insertBuyerSite({
                name,
                buyer,
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
        console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
