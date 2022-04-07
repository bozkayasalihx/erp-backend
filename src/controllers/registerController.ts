import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectSchema } from "joi";
import { IBody } from "../middlewares/isLoggedIn";
import { errorSlugify } from "../scripts/textSlugify";
import { user } from "../services";
import { IRegister } from "../validations/validate";

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

async function registerControler(req: Request<any, any, IBody>, res: Response) {
    user.insert(req.body)
        .then(result => {
            console.log("resutls", result);
            res.send(result);
        })
        .catch(err => {
            if (err.detail.includes("already exists")) {
                //FIXME: some other stuff goes here;
                return res.status(httpStatus.BAD_REQUEST).send({
                    message: "this user already in db",
                });
            }

            return res.status(httpStatus.FORBIDDEN).send(err);
        });
}

export default registerControler;
