import { Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { generateRefreshToken } from "../../scripts/utils/generateToken";
import revokeRefreshToken from "../../scripts/utils/revokeRefreshToken";
import { userOperation } from "../../services";

async function refreshController(req: Request, res: Response) {
    const refreshToken = req.refreshToken;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "lax", secure: true });

    const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;

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

        const tokenVersion = await revokeRefreshToken(user.id);

        const newRefreshToken = generateRefreshToken(
            { tokenVersion, userId: user.id },
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
            data: { refreshToken },
        });
    } catch (err) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "expired token",
        });
    }
}

export default refreshController;
