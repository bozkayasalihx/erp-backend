import { Request, Response } from "express";
import httpStatus from "http-status";

function refreshController(req: Request, res: Response) {
    const refreshToken = req.refreshToken;
    return res.status(httpStatus.OK).json({
        token: refreshToken,
    });
}

export default refreshController;
