import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    dealerSiteOperation,
    vendorOperation,
    vendorToDealerSiteOperation,
} from "../../services";

interface IParams {
    vendor_id: number;
    dealer_site_id: number;
    description?: string;
}

export default async function vdsRelations(
    req: Request<any, any, IParams>,
    res: Response
) {
    const { dealer_site_id, vendor_id, description } = req.body;

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
    });

    return res.status(httpStatus.OK).json({
        message: "operation succesful",
    });
}
