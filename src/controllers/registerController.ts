import { Request, Response } from "express";
import httpStatus from "http-status";
import { __prod__ } from "../scripts/dev";
import generateToken from "../scripts/utils/generateToken";
import { IBody } from "../middlewares/isLoggedIn";
import { user } from "../services";
import { StringRegexOptions } from "joi";

async function registerControler(req: Request<any, any, IBody>, res: Response) {
    user.insert(req.body)
        .then(({ email, username }) => {
            const access_token = generateToken(
                { name: username, email },
                process.env.ACCESS_TOKEN_SECRET_KEY as string,
                `20m`
            );

            const refresh_token = generateToken(
                { name: username, email },
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
                username,
                email,
                access_token,
            });
        })
        .catch(err => {
            if (err.detail.includes("already exists")) {
                //FIXME: some other stuff goes here;
                return res.status(httpStatus.BAD_REQUEST).send({
                    message: "this user already in exists",
                });
            }

            return res.status(httpStatus.FORBIDDEN).send(err);
        });
}

export default registerControler;
