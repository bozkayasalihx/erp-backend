import { NextFunction, Request, Response } from "express";

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
    if (!req.user) {
        return res.status(401).json({
            message: "NOT FOUND",
        });
    }

    return next();
}
