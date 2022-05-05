import { Request, Response } from "express";
import httpStatus from "http-status";
import { vendorOperation } from "../../services";

export interface IVendor {
    name: string;
    tax_no: string;
    vendor_region_id: string;
}

export default async function createVendor(
    req: Request<any, any, IVendor>,
    res: Response
) {
    const { name, tax_no, vendor_region_id } = req.body;
    const vendorRegion = await vendorOperation.vendorRegionRepo.findOne({
        where: { id: +vendor_region_id },
    });

    if (!vendorRegion) {
        return res.status(httpStatus.NOT_FOUND).json({
            message: "vendor region not found",
        });
    }

    try {
        const vendor = vendorOperation.createVendor({
            name,
            tax_no,
            vendor_region: vendorRegion,
        });
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
