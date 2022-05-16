import { Request, Response } from "express";
import httpStatus from "http-status";
import { vendorToDealerSiteToBuyerSiteOperation } from "../../services";

interface IParams {
    vdsbs_id: string;
}

export default async function getVdsbsRelations(
    req: Request<IParams>,
    res: Response
) {
    const vdsbs_id = req.params.vdsbs_id
        ? parseInt(req.params.vdsbs_id)
        : undefined;

    try {
        if (typeof vdsbs_id === "number") {
            const vdsbs =
                await vendorToDealerSiteToBuyerSiteOperation.repo.findOne({
                    where: { id: vdsbs_id },
                    relations: {
                        vToDS: true,
                        buyerSites: {
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
                buyerSites: true,
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
