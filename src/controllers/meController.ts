import { Request, Response } from "express";
import httpStatus from "http-status";
import { user as userOperation } from "../services";

export default async function me(req: Request, res: Response) {
    try {
        const userId = req.payload.userId;
        userOperation.userRepo.findOne({ where: { id: userId } });

        const user = await userOperation.userRepo.findOne({
            where: { id: userId },
        });
        if (!user) {
            return res.status(httpStatus.FORBIDDEN).json({
                message: "forbidden",
            });
        }

        return res.status(httpStatus.OK).json({
            username: user.username,
            email: user.email,
        });
    } catch (err) {
        console.log("err", err);
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}
