import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { user } from "../services";

export function isSetCookie(req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies;
    if (!cookie?.qid) return res.sendStatus(httpStatus.UNAUTHORIZED);
    const refreshToken = cookie.qid;

    return jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY as string,
        async (err: any, decode: any) => {
            console.log("err", err);
            if (err) return res.sendStatus(httpStatus.FORBIDDEN);
            const findedUser = await user.findOne({ email: decode.email });

            if (!findedUser) return res.sendStatus(httpStatus.FORBIDDEN);
            req.refreshToken = refreshToken;

            return next();
        }
    );
}
