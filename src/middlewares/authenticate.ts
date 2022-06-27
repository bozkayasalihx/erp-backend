import { NextFunction } from "express";
import httpStatus from "http-status";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { StringValidator } from "../scripts/utils/stringValidator";
import { userOperation } from "../services";
import { TypedRequest, TypedResponse } from "../types";

export default async function authenticate(
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "unauthorized request",
        });
    }
    const strValidator = new StringValidator(authHeader);
    const { head, body } = strValidator.parse(res);
    const valid = strValidator.validateHeader(head);
    if (!valid) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "invalid request",
        });
    }

    const token = body;

    if (!token) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "you must logged in for further operations",
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET_KEY as string
        );

        if (typeof payload === "string") {
            return undefined;
        }

        req.payload = {
            userId: payload.userId,
            tokenVersion: payload.tokenVersion,
        };
        const user = await userOperation.repo.findOne({
            where: { id: payload.userId },
        });

        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "unauthorized",
            });
        }

        req.user = user;
        return next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "expired token",
            });
        }

        return res.status(httpStatus.FORBIDDEN).json({
            message: "forbidden request",
        });
    }
}
