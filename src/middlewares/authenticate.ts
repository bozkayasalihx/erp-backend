import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { userOperation } from "../services";

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
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
        const user = await userOperation.repo.findOne({
            where: { id: payload.userId },
        });

        if (!user)
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "unauthorized",
            });

        req.user = user;
        return next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            // do nothings;
        } else {
            console.log("err", err);
        }

        return res.status(httpStatus.FORBIDDEN).json({
            messsage: "forbidden request",
        });
    }
}
