import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import { ILogin } from "../validations/validate";

export const validate =
    (schema: Joi.ObjectSchema<ILogin>) =>
    (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body);

        if (error) {
            const errorMessage = error.details
                .map(detail => detail.message)
                .join(", ");

            return res
                .status(httpStatus.BAD_REQUEST)
                .json({ message: errorMessage });
        }
        Object.assign(req, value);
        return next();
    };
