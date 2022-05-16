import { Request, Response } from "express";
import httpStatus from "http-status";
import {
    buyerSiteOperation,
    vendorToDealerSiteOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";

interface IParams {
    vds_rltn_id: number;
    buyer_site_id: number;
    description: string;
}

export default async function vdsbsRelationsController(
    req: Request<any, any, IParams>,
    res: Response
) {
    const { buyer_site_id, description, vds_rltn_id } = req.body;

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

    return vendorToDealerSiteToBuyerSiteOperation.createVdsbs({
        vToDS: [vds],
    });
}
