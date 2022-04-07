import { Request, Response } from "express";
import httpStatus from "http-status";
import { IBody } from "../middlewares/isLoggedIn";
import { user } from "../services";

async function registerControler(req: Request<any, any, IBody>, res: Response) {
    try {
        const userInDb = await user
            .insert(req.body)
            .then(result => {
                console.log("user saved", result);
            })
            .catch(err => {
                if (err.message.includes("already")) {
                    //FIXME: some other stuff goes here;
                }
            });

        const newUser = user.creatUser({ ...req.body });
        const findedUser = await user.insert(newUser);

        if (!findedUser) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "user does not exist",
            });
        }

        return res.status(httpStatus.OK).send(findedUser);
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
}

export default registerControler;
