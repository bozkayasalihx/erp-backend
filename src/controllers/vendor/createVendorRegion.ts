import httpStatus from "http-status";
import { vendorOperation } from "../../services";
import {
    AttributeFields,
    OptionalDates,
    TypedRequest,
    TypedResponse,
} from "../../types";

export interface IVendorRegion extends AttributeFields, OptionalDates {
    name: string;
    vendorId: number;
    attribute5?: string;
}

export default async function createVendorRegion(
    req: TypedRequest<IVendorRegion>,
    res: TypedResponse
) {
    const { name, vendorId, ...attributes } = req.body;
    const vendorRegion = vendorOperation.createVendorRegion({
        name,
        ...attributes,
    });
    const { user } = req;

    try {
        const vendor = await vendorOperation.repo.findOne({
            where: { id: vendorId },
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
