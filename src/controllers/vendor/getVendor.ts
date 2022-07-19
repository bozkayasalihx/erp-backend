import { Request } from "express";
import httpStatus from "http-status";
import { Vendor } from "../../models";
import { vendorOperation } from "../../services";
import { TypedResponse } from "../../types";

interface IGetVendor {
    vendorId?: number;
}

export default async function getVendor(
    req: Request<IGetVendor>,
    res: TypedResponse
) {
    const { vendorId } = req.params;

    if (typeof vendorId === "number") {
        try {
            const vendor = await vendorOperation.repo.findOne({
                where: { id: vendorId },
            });

            return res.status(httpStatus.OK).json({
                message: "successful operation",
                data: vendor as Vendor,
            });
        } catch (err) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "bad request",
            });
        }
    }
    try {
        const allVendors = await vendorOperation.repo.find({});
        return res.status(httpStatus.OK).json({
            message: "succesfull operation",
            data: allVendors,
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "bad request",
        });
    }
}
