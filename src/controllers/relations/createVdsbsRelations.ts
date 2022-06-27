import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    buyerSiteOperation,
    vendorToDealerSiteOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import { OptionalDates } from "../../types";

export interface IVDSBSRelations extends OptionalDates {
    vdsRltnId: number;
    buyerSiteId: number;
    description: string;
}

export default async function vdsbsRelationsController(
    req: Request<any, any, IVDSBSRelations>,
    res: Response
) {
    const { buyerSiteId, description, vdsRltnId, ...dates } = req.body;

    try {
        const buyerSite = await buyerSiteOperation.repo.findOne({
            where: { id: buyerSiteId },
        });

        if (!buyerSite) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "invalid id",
            });
        }

        const vds = await vendorToDealerSiteOperation.repo.findOne({
            where: { id: vdsRltnId },
        });

        if (!vds) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "invalid id",
            });
        }

        await vendorToDealerSiteToBuyerSiteOperation.createVdsbs({
            buyerSite,
            description,
            vToDS: vds,
            ...dates,
            updated_by: req.user,
            created_by: req.user,
        });

        return res.status(httpStatus.CREATED).json({
            message: "successful operation",
        });
    } catch (err) {
        if (err?.detail.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "this vdsbs already exists",
            });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
