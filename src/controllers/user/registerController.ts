import { Request, Response } from "express";
import httpStatus from "http-status";
import { IBody } from "../../middlewares/isLoggedIn";
import { __prod__ } from "../../scripts/dev";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../scripts/utils/generateToken";
import userOperation from "../../services/userOperation";
import { OptionalDates } from "../../types";

async function registerControler(
    req: Request<any, any, IBody & OptionalDates>,
    res: Response
) {
    try {
        const user = await userOperation.insert(req.body);
        const accessToken = generateAccessToken(
            { userId: user.id, tokenVersion: user.tokenVersion },
            process.env.ACCESS_TOKEN_SECRET_KEY as string
        );

        const refreshToken = generateRefreshToken(
            { userId: user.id, tokenVersion: user.tokenVersion },
            process.env.REFRESH_TOKEN_SECRET_KEY as string
        );

        res.cookie("qid", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: __prod__,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(httpStatus.CREATED).json({
            message: "operation succesful",
            data: {
                username: user.username,
                email: user.email,
                accessToken,
            },
        });
    } catch (err) {
        if (err?.detail?.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).send({
                message: "this user already in exists",
            });
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}

export default registerControler;
