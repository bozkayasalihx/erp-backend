import { randomBytes } from "crypto";
import { Request, Response } from "express";
import httpStatus from "http-status";
import event from "../scripts/eventEmitter";
import userOperation from "../services/user";

export const resetPasswordController = async (
    req: Request<any, any, { email: string }>,
    res: Response
) => {
    const { email } = req.body;
    const newPasword = randomBytes(10).toString("hex");
    try {
        const user = await userOperation.userRepo.findOne({ where: { email } });

        if (!user) {
            return res.sendStatus(httpStatus.BAD_REQUEST);
        }

        await userOperation.insert({
            ...user,
            password: newPasword,
        });

        event.emit("send_email", {
            toEmail: email,
            subject: "Password Reset",
            html: `The password reset has been sent upon your request. <br/> after fist login please change your password <br/> New Password: ${newPasword}`,
        });

        return res
            .status(httpStatus.OK)
            .send("reset password mail sent your email ");
    } catch (err) {
        console.log("err", err);
        if (err.detail.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).send({
                message: "this user already in exists",
            });
        }
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send("unknown error happened, try again latter");
    }
};

export default resetPasswordController;
