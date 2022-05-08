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

    try {
        const payload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET_KEY as string
        );

        if (typeof payload === "string") {
            console.log("paylaod type is string", payload);
            return;
        }

        req.payload = {
            userId: payload.userId,
            tokenVersion: payload.tokenVersion,
        };
        return next();
    } catch (err) {
        console.log("err", err);
        return res.status(httpStatus.FORBIDDEN).json({
            messsage: "forbidden request",
        });
    }
}
