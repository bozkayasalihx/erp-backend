import { Request, Response } from "express";
import httpStatus from "http-status";
import { __prod__ } from "../../scripts/dev";
import { vendorOperation } from "../../services";
import { IVendorRegion } from "./createVendorRegion";

export default async function updateVendorRegion(
    req: Request<any, any, Partial<IVendorRegion> & { id: number }>,
    res: Response<{ message: string; data?: string }>
) {
    const { id } = req.body;
    const user = req.user;

    try {
        const vendorRegion = await vendorOperation.vendorRegionRepo.findOne({
            where: { id },
        });

        if (!vendorRegion)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "invalid request",
            });

        if (req.body.name) vendorRegion.name = req.body.name;
        vendorRegion.updated_by = user;
        await vendorRegion.save();

        return res.status(httpStatus.OK).json({
            message: "successfully updated",
        });
    } catch (err) {
        !__prod__ && console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
