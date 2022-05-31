import { Request, Response } from "express";
import httpStatus from "http-status";
import { vendorOperation } from "../../services";
import { AttributeFields, OptionalDates } from "../../types/types";

export interface IVendor extends AttributeFields, OptionalDates {
    name: string;
    tax_no: string;
    attribute5?: string;
}

export default async function createVendor(
    req: Request<any, any, IVendor>,
    res: Response
) {
    const { name, tax_no, ...attributes } = req.body;
    const user = req.user;
    const vendor = vendorOperation.createVendor({
        name,
        tax_no,
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
