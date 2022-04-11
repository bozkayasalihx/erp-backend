import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.replace("Bearer ", "");

    if (!token) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .send("you must logged in for further operations");
    }

    return jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET_KEY as string,
        (err, user: any) => {
            if (err)
                return res.status(httpStatus.FORBIDDEN).send("invalid token");
            req.user = user;

            return next();
        }
    );
}
