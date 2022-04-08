import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectSchema } from "joi";
import { errorSlugify } from "../scripts/textSlugify";

export default class Validate<T> {
    // constructor(private params: T) {}
    public validate(schema: ObjectSchema<T>) {
        return (req: Request, res: Response, next: NextFunction) => {
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
    }
}
