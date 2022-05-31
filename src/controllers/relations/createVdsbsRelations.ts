import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    buyerSiteOperation,
    vendorToDealerSiteOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import { OptionalDates } from "../../types/types";

export interface IVDSBSRelations extends OptionalDates {
    vds_rltn_id: number;
    buyer_site_id: number;
    description: string;
}

export default async function vdsbsRelationsController(
    req: Request<any, any, IVDSBSRelations>,
    res: Response
) {
    const { buyer_site_id, description, vds_rltn_id, ...dates } = req.body;

    try {
        const buyerSite = await buyerSiteOperation.repo.findOne({
            where: { id: buyer_site_id },
        });

        if (!buyerSite) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "invalid id",
            });
        }

        const vds = await vendorToDealerSiteOperation.repo.findOne({
            where: { id: vds_rltn_id },
        });

        if (!vds) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "invalid id",
            });
        }

        await vendorToDealerSiteToBuyerSiteOperation.createVdsbs({
            buyer_site_id: buyerSite.id,
            description,
            vds_rltn_id: vds.id,
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
