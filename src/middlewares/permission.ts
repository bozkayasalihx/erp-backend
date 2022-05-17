import { NextFunction, Request, Response } from "express";

export default function permission(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userType = req.user.user_type;

    console.log("yurl", req.url);

    next();
}
