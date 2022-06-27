import { Request, Response } from "express";
import httpStatus from "http-status";
import { vendorToDealerSiteToBuyerSiteOperation } from "../../services";

interface IParams {
    vdsbsId: string;
}

export default async function getVdsbsRelations(
    req: Request<IParams>,
    res: Response
) {
    const vdsbsId = req.params.vdsbsId
        ? parseInt(req.params.vdsbsId, 10)
        : undefined;

    try {
        if (typeof vdsbsId === "number") {
            const vdsbs =
                await vendorToDealerSiteToBuyerSiteOperation.repo.findOne({
                    where: { id: vdsbsId },
                    relations: {
                        vToDS: true,
                        buyerSite: {
                            buyer: true,
                        },
                    },
                });

            return res.status(httpStatus.OK).json({
                message: "operation successful",
                data: vdsbs,
            });
        }

        const data = await vendorToDealerSiteToBuyerSiteOperation.repo.find({
            relations: {
                vToDS: true,
                buyerSite: true,
            },
        });

        return res.status(httpStatus.OK).json({
            message: "operation successful",
            data,
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
