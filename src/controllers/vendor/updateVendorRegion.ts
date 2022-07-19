import httpStatus from "http-status";
import { Vendor } from "../../models";
import { vendorOperation } from "../../services";
import { TypedRequest, TypedResponse } from "../../types";
import { IVendorRegion } from "./createVendorRegion";

export type UpdateVendorRegion = Partial<IVendorRegion> & { id: number };

export default async function updateVendorRegion(
    req: TypedRequest<UpdateVendorRegion>,
    res: TypedResponse
) {
    const { id, name, vendorId, ...attributes } = req.body;
    const { user } = req;

    try {
        const vendorRegion = await vendorOperation.vendorRegionRepo.findOne({
            where: { id },
        });

        if (!vendorRegion) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "no such as vendor region",
            });
        }

        let vendor: Vendor | null = null;

        if (vendorId) {
            vendor = await vendorOperation.repo.findOne({
                where: { id: vendorId },
            });

            if (!vendor) {
                return res.status(httpStatus.NOT_FOUND).json({
                    message: "not found such as vendor",
                });
            }
        }

        const keys = Object.keys(attributes);
        for (let i = 0; i < keys.length; i++) {
            if (attributes[keys[i]])
                vendorRegion[keys[i]] = attributes[keys[i]];
        }
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
