import { Request, Response } from "express";
import httpStatus from "http-status";
import { IBody } from "../middlewares/isLoggedIn";
import { __prod__ } from "../scripts/dev";
import generateToken from "../scripts/utils/generateToken";
import userOperation from "../services/user";

async function loginController(req: Request<any, any, IBody>, res: Response) {
    const { email, username } = req.body;
    try {
        const user = await userOperation.login(email, username);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "user does not exist",
            });
        }

        if (req.payload.tokenVersion !== user.tokenVersion) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "not authenticated",
            });
        }

        const accesTokenExpire = `${process.env.ACCESS_TOKEN_EXPIRE}`;
        const refreshTokenExpire = `${process.env.REFRESH_TOKEN_EXPIRE}`;
        const access_token = generateToken(
            { userId: user.id, tokenVersion: user.tokenVersion },
            process.env.ACCESS_TOKEN_SECRET_KEY as string,
            accesTokenExpire
        );
        const refresh_token = generateToken(
            { userId: user.id, tokenVersion: user.tokenVersion },
            process.env.REFRESH_TOKEN_SECRET_KEY as string,
            refreshTokenExpire
        );
        res.cookie("qid", refresh_token, {
            httpOnly: true,
            sameSite: "lax",
            secure: __prod__,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(httpStatus.OK).json({
            username: user.username,
            email: user.email,
            access_token,
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
}

export default loginController;
