import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { ObjectSchema } from "joi";
import { ILogin } from "../validations/validate";
import { IBody } from "../middlewares/isLoggedIn";
import { user } from "../services";

export const validateLogin =
    (schema: ObjectSchema<ILogin>) =>
    (req: Request<any, any, ILogin>, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body);

        if (error) {
            const errorMessage = errorSlugify(error.details);
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({ message: errorMessage });
        }
        Object.assign(req, value);
        return next();
    };

async function loginController(req: Request<any, any, IBody>, res: Response) {
    const email = req.body.email;
    try {
        const findedUser = await user.login(email);

        if (!findedUser) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "user does not exist",
            });
        }

        const access_token = jwt.sign(
            { name: findedUser.username, ...findedUser },
            process.env.ACCESS_TOKEN_SECRET_KEY as string,
            { expiresIn: "1d" }
        );
        const refresh_token = jwt.sign(
            {
                name: findedUser.username,
                ...findedUser,
            },
            process.env.ACCESS_TOKEN_SECRET_KEY as string
        );

        const tokens = {
            access_token,
            refresh_token,
        };
        return res.status(httpStatus.OK).json({ user: findedUser, tokens });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
}

export default loginController;
function errorSlugify(details: import("joi").ValidationErrorItem[]) {
    throw new Error("Function not implemented.");
}
