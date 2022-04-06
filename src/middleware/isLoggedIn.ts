import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface IBody {
    username: string;
    email: string;
    password: string;
}
export default function isLoggedIn(
    req: Request<any, any, IBody>,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log("token", token);

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SALT as string, (err: any, user: any) => {
        console.log(err);

        if (err) return res.sendStatus(403);

        req.user = user;

        return next();
    });
}
