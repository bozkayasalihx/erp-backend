import { Request, Response } from "express";
import httpStatus from "http-status";
import { vendorOperation } from "../../services";

export interface IVendorRegion {
    name: string;
    vendor_id: number;
}

export default async function createVendorRegion(
    req: Request<any, any, IVendorRegion>,
    res: Response
) {
    const { name, vendor_id } = req.body;
    const vendorRegion = vendorOperation.createVendorRegion({ name });

    try {
        const vendor = await vendorOperation.repo.findOne({
            where: { id: vendor_id },
        });

        if (!vendor) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "invalid vendor",
            });
        }
        vendorRegion.vendor = vendor;
        await vendorRegion.save();
        return res.status(httpStatus.OK).json({
            message: "succesfully created ",
        });
    } catch (err) {
        console.log("err", err);
        if (err.detail.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "this vendor region already exists",
            });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured",
        });
    }
}
