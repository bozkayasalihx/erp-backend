import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    dealerSiteOperation,
    vendorOperation,
    vendorToDealerSiteOperation,
} from "../../services";

export interface IVdsRelations {
    vendor_id: number;
    dealer_site_id: number;
    description?: string;
}

export default async function vdsRelations(
    req: Request<any, any, IVdsRelations>,
    res: Response
) {
    const { dealer_site_id, vendor_id, description } = req.body;

    try {
        const dealerSite = await dealerSiteOperation.repo.findOne({
            where: { id: dealer_site_id },
        });
        if (!dealerSite) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "invalid id",
            });
        }

        const vendor = await vendorOperation.repo.findOne({
            where: { id: vendor_id },
        });

        if (!vendor) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "invalid id",
            });
        }

        await vendorToDealerSiteOperation.createVds({
            vendor,
            dealerSite,
            description,
            updated_by: req.user,
            created_by: req.user,
        });

        return res.status(httpStatus.OK).json({
            message: "operation succesful",
        });
    } catch (err) {
        if (err?.detail?.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "vds already exists",
            });
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
