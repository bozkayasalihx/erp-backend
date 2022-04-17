import { Request, Response } from "express";
import httpStatus from "http-status";
import { IBody } from "../middlewares/isLoggedIn";
import { __prod__ } from "../scripts/dev";
import generateToken from "../scripts/utils/generateToken";
import userOperation from "../services/user";

async function registerControler(req: Request<any, any, IBody>, res: Response) {
    try {
        const user = await userOperation.insert(req.body);
        const access_token = generateToken(
            { userId: user.id, tokenVersion: user.tokenVersion },
            process.env.ACCESS_TOKEN_SECRET_KEY as string,
            `10m`
        );

        const refresh_token = generateToken(
            { userId: user.id, tokenVersion: user.tokenVersion },
            process.env.REFRESH_TOKEN_SECRET_KEY as string,
            `1d`
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
        console.log("erro", err);
        if (err.detail.includes("already exists")) {
            //FIXME: some other stuff goes here
            return res.status(httpStatus.BAD_REQUEST).send({
                message: "this user already in exists",
            });
        }

        return res.status(httpStatus.FORBIDDEN).send("error accured");
    }
}

export default registerControler;
