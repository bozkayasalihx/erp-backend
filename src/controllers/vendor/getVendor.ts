import { Request, Response } from "express";
import httpStatus from "http-status";
import { vendorOperation } from "../../services";

export default async function getVendor(
    req: Request<{ vendorId?: number }>,
    res: Response
) {
    const vendorId = req.params.vendorId;

    if (typeof vendorId === "number") {
        try {
            const vendor = await vendorOperation.repo.findOne({
                where: { id: vendorId },
            });

            return res.status(httpStatus.OK).json({
                message: "successful operation",
                data: vendor,
            });
        } catch (err) {
            console.log("err", err);
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
        console.log("err", err);

        return res.status(httpStatus.BAD_REQUEST).json({
            message: "bad request",
        });
    }
}
