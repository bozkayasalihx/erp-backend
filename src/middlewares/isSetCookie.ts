import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

export function isSetCookie(req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies;
    if (!cookie?.qid) return res.sendStatus(httpStatus.UNAUTHORIZED);
    const refreshToken = cookie.qid;

    try {
        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY as string
        );

        if (typeof payload === "string") {
            console.log("payload type is string", payload);
            return;
        }

        req.payload = {
            userId: payload.userId,
            tokenVersion: payload.tokenVersion,
        };
        return next();
    } catch (err) {
        console.log("err", err);
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "an error accured",
        });
    }
}
