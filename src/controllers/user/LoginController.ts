import { compare } from "bcryptjs";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { IBody } from "../../middlewares/isLoggedIn";
import { __prod__ } from "../../scripts/dev";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../scripts/utils/generateToken";
import userOperation from "../../services/userOperation";

async function loginController(req: Request<any, any, IBody>, res: Response) {
    const { email, username, password } = req.body;
    try {
        const user = await userOperation.login(email, username);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "user does not exist",
            });
        }

        const valid = await compare(password, user.password);

        if (!valid) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "email or password wrong",
            });
        }

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
        return res.status(httpStatus.OK).json({
            message: "operation succesful",
            data: {
                username: user.username,
                user_type: user.userType,
                accessToken,
            },
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accoured try again later",
            data: err?.detail,
        });
    }
}

export default loginController;
