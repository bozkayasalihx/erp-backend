import { Request, Response } from "express";
import httpStatus from "http-status";
import { User, VendorRegion } from "../../models";
import { __prod__ } from "../../scripts/dev";
import { vendorOperation } from "../../services";
import { IVendor } from "./createVendor";

const updater = <
    T extends {
        id: number;
        updated_by: User;
        created_by: User;
        save: () => void;
    }
>(
    params: Array<T>,
    newOne: any
) => {
    const temp: any[] = [];
    for (let i = 0; i < params.length; i++) {
        params[i].updated_by = newOne;
        params[i].save();
        temp.push(params[i]);
    }

    return Promise.all(temp);
};

export default async function updateVendor(
    req: Request<any, any, Partial<IVendor> & { id: number }>,
    res: Response<{ message: string; data?: string }>
) {
    const { id, name, tax_no, vendor_region_ids } = req.body;
    const user = req.user;

    try {
        const vendor = await vendorOperation.repo.findOne({
            where: { id },
        });

        if (!vendor)
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "not such as vendor",
            });

        if (vendor_region_ids) {
            let vendorRegions = await vendorOperation.vendorRegionRepo
                .createQueryBuilder("vr")
                .whereInIds(vendor_region_ids)
                .getMany();

            if (!vendorRegions.length) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message:
                        "no such as vendor region check entered vendor region",
                });
            }

            if (name) vendor.name = name;
            if (tax_no) vendor.tax_no = tax_no;

            vendorRegions = await updater<VendorRegion>(vendorRegions, user);
            vendor.vendor_regions = vendorRegions;
            await vendor.save();

            return res.status(httpStatus.OK).json({
                message: "successfully udpated",
            });
        }

        vendor.vendor_regions = [];
        await vendor.save();

        return res.status(httpStatus.OK).json({
            message: "successfully udpated",
        });
    } catch (err) {
        !__prod__ && console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
