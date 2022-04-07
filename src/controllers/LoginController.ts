import { Request, Response } from "express";
import httpStatus from "http-status";
import { IBody } from "../middlewares/isLoggedIn";
import { user } from "../services";

async function loginController(req: Request<any, any, IBody>, res: Response) {
    const email = req.body.email;
    try {
        const findedUser = await user.login(email);

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

export default loginController;
