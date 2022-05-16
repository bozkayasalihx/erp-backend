import { Request, Response } from "express";
import httpStatus from "http-status";
import { Vendor } from "../../models";
import { vendorOperation } from "../../services";
import { IVendorRegion } from "./createVendorRegion";

export default async function updateVendorRegion(
    req: Request<any, any, Partial<IVendorRegion> & { id: number }>,
    res: Response<{ message: string; data?: string }>
) {
    const { id, name, vendor_id } = req.body;
    const user = req.user;

    try {
        const vendorRegion = await vendorOperation.vendorRegionRepo.findOne({
            where: { id },
        });

        if (!vendorRegion)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "no such as vendor region",
            });

        let vendor: Vendor | null = null;

        if (vendor_id) {
            vendor = await vendorOperation.repo.findOne({
                where: { id: vendor_id },
            });

            if (!vendor) {
                return res.status(httpStatus.NOT_FOUND).json({
                    message: "not found such as vendor",
                });
            }
        }

        if (name) vendorRegion.name = name;

        if (vendor) vendorRegion.vendor = vendor;
        vendorRegion.updated_by = user;
        await vendorRegion.save();

        return res.status(httpStatus.OK).json({
            message: "successfully updated",
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
