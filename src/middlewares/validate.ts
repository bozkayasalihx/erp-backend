import { NextFunction, Request, Response } from "express";
import { ObjectSchema, ValidationErrorItem } from "joi";
import httpStatus from "http-status";
import { ILogin, IRegister } from "../validations/validate";

function errorSlugify(error: Array<ValidationErrorItem>) {
    return error
        .map(detail => {
            return detail.message;
        })
        .join(", ");
}

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

export const validateRegister =
    (schema: ObjectSchema<IRegister>) =>
    (req: Request<any, any, IRegister>, res: Response, next: NextFunction) => {
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
