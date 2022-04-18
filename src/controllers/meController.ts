import { Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { generateRefreshToken } from "../scripts/utils/generateToken";
import revokeRefreshToken from "../scripts/utils/revokeRefreshToken";
import userOperation from "../services/user";

export default async function me(req: Request, res: Response) {
    try {
        const token = req.cookies.qid;
        const payload = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET_KEY as string
        ) as jwt.JwtPayload;

        const user = await userOperation.userRepo.findOne({
            where: { id: payload.userId },
        });

        if (!user)
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "user not found",
            });

        const valid = await revokeRefreshToken(user.id);
        if (!valid)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: "an error accured",
            });

        const newToken = generateRefreshToken(
            {
                userId: user.id,
                tokenVersion: user.tokenVersion,
            },
            process.env.ACCESS_TOKEN_SECRET_KEY as string
        );

        return res.status(httpStatus.OK).json({
            token: newToken,
        });
    } catch (err) {
        console.log("err", err);
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}
