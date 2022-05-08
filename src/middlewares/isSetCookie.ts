import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export function isSetCookie(req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies;
    if (!cookie?.qid) return res.sendStatus(httpStatus.UNAUTHORIZED);
    req.refreshToken = cookie.qid;
    return next();
}
