import { Request, Response } from "express";
import httpStatus from "http-status";
import { userEntityAccessOperation } from "../../services";

export default async function getUserEntityAccess(req: Request, res: Response) {
    try {
        const accessList = await userEntityAccessOperation.getByUser(
            req.user.id,
            true
        );

        return res.status(httpStatus.OK).json({
            message: "successfull operation",
            data: accessList,
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "bad request",
        });
    }
}
