import { Request, Response } from "express";
import httpStatus from "http-status";
import { vendorOperation } from "../../services";
import { AttributeFields, OptionalDates } from "../../types";

export interface IVendor extends AttributeFields, OptionalDates {
    name: string;
    taxNo: string;
    attribute5?: string;
}

export default async function createVendor(
    req: Request<any, any, IVendor>,
    res: Response
) {
    const { name, taxNo, ...attributes } = req.body;
    const { user } = req;
    const vendor = vendorOperation.createVendor({
        name,
        taxNo,
        ...attributes,
    });

    try {
        vendor.updated_by = user;
        vendor.created_by = user;
        await vendor.save();
        return res.status(httpStatus.CREATED).json({
            message: "succesfully created",
            data: { vendor },
        });
    } catch (err) {
        if (err?.detail?.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "this vendor already exists",
            });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
