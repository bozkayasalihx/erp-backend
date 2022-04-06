import { Request, Response } from "express";
import { IBody } from "../middlewares/isLoggedIn";
import { user } from "../services";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";

async function loginController(req: Request<any, any, IBody>, res: Response) {
    const { email, username, password } = req.body;
    // some validation logic goes here;

    const hashedPassword = await bcrypt.hash(
        password,
        process.env.SALT as string
    );
    try {
        const newUser = await user.insert({
            email,
            username,
            password: hashedPassword,
        });

        return res.status(httpStatus.CREATED).json({ user: newUser });
    } catch (err) {
        console.log("err", err);
        return res.status(httpStatus.SERVICE_UNAVAILABLE);
    }
}

export default loginController;
