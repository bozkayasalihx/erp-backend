import { Request, Response } from "express";
import httpStatus from "http-status";
import { IBody } from "../middlewares/isLoggedIn";
import { __prod__ } from "../scripts/dev";
import generateToken from "../scripts/utils/generateToken";
import { user } from "../services";

async function loginController(req: Request<any, any, IBody>, res: Response) {
    const email = req.body.email;

    // const  roles = new RoleFunction()
    // roles.role_name = UserTypes.BUYER

    // const role = new FunctionType()

    try {
        const findedUser = await user.login(email);
        if (!findedUser) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "user does not exist",
            });
        }
        const accesTokenExpire = `${process.env.ACCESS_TOKEN_EXPIRE}`;
        const refreshTokenExpire = `${process.env.REFRESH_TOKEN_EXPIRE}`;
        const access_token = generateToken(
            { name: findedUser.username, email: findedUser.email },
            process.env.ACCESS_TOKEN_SECRET_KEY as string,
            accesTokenExpire
        );
        const refresh_token = generateToken(
            { name: findedUser.username, email: findedUser.email },
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
            username: findedUser.username,
            email: findedUser.email,
            access_token,
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
}

export default loginController;
function errorSlugify(details: import("joi").ValidationErrorItem[]) {
    throw new Error("Function not implemented.");
}
