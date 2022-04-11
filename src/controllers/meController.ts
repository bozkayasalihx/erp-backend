import { Request, Response } from "express";
import httpStatus from "http-status";
import { user as userOperation } from "../services";

export default async function me(req: Request, res: Response) {
    const email = req.user.email;
    const user = await userOperation.findOne({ email });
    return res.status(httpStatus.OK).json({
        username: user?.username,
        email: user?.email,
    });
}
