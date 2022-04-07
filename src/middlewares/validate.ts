import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectSchema } from "joi";
import { errorSlugify } from "../scripts/textSlugify";
import { ILogin } from "../validations/validate";
import { IBody } from "./isLoggedIn";

export const validate =
    (schema: ObjectSchema<ILogin>) =>
    (
        req: Request<any, any, Partial<IBody>>,
        res: Response,
        next: NextFunction
    ) => {
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
