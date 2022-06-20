import { Request, Response } from "express";
import http_status from "http-status";
import { userEntityAccessOperation } from "../../services";

export default async function getUserEntityAccess(req: Request, res: Response) {
    try {
        const access_list = await userEntityAccessOperation.getByUser(
            req.user.id,
            true
        );

        return res.status(http_status.OK).json({
            message: "successfull operation",
            data: access_list,
        });
    } catch (err) {
        return res.status(http_status.BAD_REQUEST).json({
            message: "bad request",
        });
    }
}
