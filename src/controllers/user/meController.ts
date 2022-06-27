import { Request, Response } from "express";
import httpStatus from "http-status";

export default async function me(req: Request, res: Response) {
    const { user } = req;
    return res.status(httpStatus.OK).json({
        message: "operation succesful",
        data: {
            username: user.username,
            user_type: user.userType,
            id: user.id,
        },
    });
}
