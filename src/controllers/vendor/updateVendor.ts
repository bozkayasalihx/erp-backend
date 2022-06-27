import httpStatus from "http-status";
import { vendorOperation } from "../../services";
import { TypedRequest, TypedResponse } from "../../types";
import { IVendor } from "./createVendor";

export type UpdateVendor = Partial<IVendor> & { id: number };

export default async function updateVendor(
    req: TypedRequest<UpdateVendor>,
    res: TypedResponse
) {
    const { id, name, taxNo, ...attributes } = req.body;
    const { user } = req;

    try {
        const vendor = await vendorOperation.repo.findOne({
            where: { id },
        });

        if (!vendor) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "not such as vendor",
            });
        }

        const keys = Object.keys(attributes);
        for (let i = 0; i < keys.length; i++) {
            if (attributes[keys[i]]) vendor[keys[i]] = attributes[keys[i]];
        }
        vendor.updated_by = user;

        await vendor.save();

        return res.status(httpStatus.OK).json({
            message: "successfully updated",
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
