import { Request, Response } from "express";
import httpStatus from "http-status";
import { vendorOperation } from "../../services";

interface CreateVendorRegion {
    name: string;
}

export default async function createVendorRegion(
    req: Request<any, any, CreateVendorRegion>,
    res: Response
) {
    const { name } = req.body;
    const vendorRegion = vendorOperation.createVendorRegion({ name });

    try {
        await vendorRegion.save();
        return res.status(httpStatus.OK).json({
            message: "succesfully created ",
        });
    } catch (err) {
        console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured",
        });
    }
}
