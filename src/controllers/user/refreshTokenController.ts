import { Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../scripts/utils/generateToken";
import revokeRefreshToken from "../../scripts/utils/revokeRefreshToken";
import { userOperation } from "../../services";

async function refreshController(req: Request, res: Response) {
    const refreshToken = req.refreshToken;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "lax", secure: true });

    const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
    // { userId: user.id, tokenVersion: user.tokenVersion }

    console.log(decoded);

    const user = await userOperation.repo.findOne({
        where: { id: decoded.userId },
    });

    if (!user)
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "unauthorized request",
        });

    if (user.tokenVersion !== decoded.tokenVersion) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "invalid request",
        });
    }

    try {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY
        ) as jwt.JwtPayload;

        await revokeRefreshToken(user.id);

        const accessToken = generateAccessToken(
            {
                tokenVersion: 2,
                userId: user.id,
            },
            process.env.ACCESS_TOKEN_SECRET_KEY
        );

        const newRefreshToken = generateRefreshToken(
            { tokenVersion: 2, userId: user.id },
            process.env.REFRESH_TOKEN_SECRET_KEY
        );

        res.cookie("qid", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(httpStatus.OK).json({
            message: "succesful operation",
            accessToken,
        });
    } catch (err) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "expired token",
        });
    }
}

export default refreshController;
