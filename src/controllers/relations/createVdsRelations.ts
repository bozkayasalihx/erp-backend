import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    dealerSiteOperation,
    vendorOperation,
    vendorToDealerSiteOperation,
} from "../../services";
import { OptionalDates } from "../../types";

export interface IVdsRelations extends OptionalDates {
    vendorId: number;
    dealerSiteId: number;
    description?: string;
}

export default async function vdsRelations(
    req: Request<any, any, IVdsRelations>,
    res: Response
) {
    const { dealerSiteId, vendorId, description, ...dates } = req.body;
    const { user } = req;

    try {
        const dealerSite = await dealerSiteOperation.repo.findOne({
            where: { id: dealerSiteId },
        });
        if (!dealerSite) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "invalid id",
            });
        }

        const vendor = await vendorOperation.repo.findOne({
            where: { id: vendorId },
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
            ...dates,
            updated_by: user,
            created_by: user,
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
