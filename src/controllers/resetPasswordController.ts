import { Request, Response } from "express";
import httpStatus from "http-status";
import event from "../scripts/eventEmitter";
import { randomBytes } from "crypto";
import { user } from "../services";

export const resetPasswordController = (
    req: Request<any, any, { email: string }>,
    res: Response
) => {
    const email = req.body.email;
    const newPasword = randomBytes(10).toString("hex");
    user.findOne({ email })
        .then(findedUser => {
            if (!findedUser) {
                res.status(httpStatus.NOT_FOUND).send("User not found");
                return;
            }

            return user.insert({ ...findedUser, password: newPasword });
        })
        .then(insertedUser => {
            console.log("reset password inserted user", insertedUser);
            event.emit("send_email", {
                toEmail: email,
                subject: "Password Reset",
                html: `The password reset has been sent upon your request. <br/> after fist login please change your password <br/> New Password: ${newPasword}`,
            });

            return res
                .status(httpStatus.OK)
                .send("reset password mail sent your email ");
        })
        .catch(err => {
            console.log("err", err);
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send("unknown error happened, try again latter");
        });
};

export default resetPasswordController;
