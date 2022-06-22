import { Request, Response } from "express";
import httpStatus from "http-status";

async function logoutController(req: Request, res: Response) {
    res.clearCookie("qid");

    return res.status(httpStatus.OK).json({
        message: "operation succesful",
    });
}

export default logoutController;
