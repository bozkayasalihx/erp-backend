import { Request, Response } from "express";
import httpStatus from "http-status";
import { IBody } from "../middlewares/isLoggedIn";
import { user } from "../services";

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
