import { Request, Response } from "express";
import httpStatus from "http-status";
import { __prod__ } from "../../scripts/dev";
import { vendorOperation } from "../../services";
import { IVendor } from "./createVendor";

export default async function updateVendor(
    req: Request<any, any, Partial<IVendor> & { id: number }>,
    res: Response<{ message: string; data?: string }>
) {
    const { id, name, tax_no } = req.body;
    const user = req.user;

    try {
        const vendor = await vendorOperation.repo.findOne({
            where: { id },
        });

        if (!vendor)
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "not such as vendor",
            });

        if (req.body.vendor_region_id) {
            const vendorRegion = await vendorOperation.vendorRegionRepo.findOne(
                { where: { id: +req.body.vendor_region_id } }
            );
            if (!vendorRegion) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message:
                        "no such as vendor region check entered vendor region",
                });
            }

            if (name) vendor.name = name;
            if (tax_no) vendor.tax_no = tax_no;
            vendorRegion.updated_by = user;
            await vendorRegion.save();
            await vendor.save();

            return res.status(httpStatus.OK).json({
                message: "successfully udpated",
            });
        }
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "check entered values",
        });
    } catch (err) {
        !__prod__ && console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
