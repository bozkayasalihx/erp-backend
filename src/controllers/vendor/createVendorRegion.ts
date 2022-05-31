import { Request, Response } from "express";
import httpStatus from "http-status";
import { vendorOperation } from "../../services";
import { AttributeFields, OptionalDates } from "../../types/types";

export interface IVendorRegion extends AttributeFields, OptionalDates {
    name: string;
    vendor_id: number;
    attribute5?: string;
}

export default async function createVendorRegion(
    req: Request<any, any, IVendorRegion>,
    res: Response
) {
    const { name, vendor_id, ...attributes } = req.body;
    const vendorRegion = vendorOperation.createVendorRegion({
        name,
        ...attributes,
    });
    const user = req.user;

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
        vendorRegion.updated_by = user;
        vendorRegion.created_by = user;
        await vendorRegion.save();
        return res.status(httpStatus.OK).json({
            message: "succesfully created ",
        });
    } catch (err) {
        if (err?.detail?.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "this vendor region already exists",
            });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured",
        });
    }
}
