import { Request, Response } from "express";
import httpStatus from "http-status";
import { vendorOperation } from "../../services";

export interface IVendor {
    name: string;
    tax_no: string;
    vendor_region_ids: Array<number>;
}

export default async function createVendor(
    req: Request<any, any, IVendor>,
    res: Response
) {
    const { name, tax_no, vendor_region_ids } = req.body;

    const vendor = vendorOperation.createVendor({
        name,
        tax_no,
    });

    if (vendor_region_ids.length <= 0) {
        vendor.vendor_regions = [];
    } else {
        const vendorRegions = await vendorOperation.vendorRegionRepo
            .createQueryBuilder("vr")
            .whereInIds(vendor_region_ids)
            .getMany();

        if (!vendorRegions) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "vendor region not found",
            });
        }

        vendor.vendor_regions = vendorRegions;
    }

    try {
        await vendor.save();
        return res.status(httpStatus.OK).json({
            message: "succesfully created",
            vendor,
        });
    } catch (err) {
        console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
