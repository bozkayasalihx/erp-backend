import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import LoginAuth from "../auth/loginAuth";
import { appDataSource } from "../bootstrap";
import { IBody } from "../middleware/isLoggedIn";
import { User } from "../models";

async function loginController(req: Request<any, any, IBody>, res: Response) {
    const { email, username, password } = req.body;

    const loginAuth = new LoginAuth({ email, username, password });

    const validEmail = loginAuth.validateEmail();
    const validUsenrame = loginAuth.validateUsername();
    const validPassword = loginAuth.validatePassword();

    console.log("valid email", validEmail);
    console.log("valid username", validUsenrame);
    console.log("valid password", validPassword);

    const userRepo = appDataSource.getRepository(User);

    const token = jwt.sign(
        { name: req.body.username },
        process.env.SALT as string,
        {
            expiresIn: 60 * 2,
            algorithm: "HS256",
        }
    );

    return res.json({
        token,
    });
}

export default loginController;
