import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

export function isSetCookie(req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies;
    if (!cookie?.qid) return res.sendStatus(httpStatus.UNAUTHORIZED);
    return next();
}
