import { Request, Response } from "express";
// import { appDataSource } from "../loaders";
import { User } from "../models";

export default async function me(req: Request, res: Response) {
    return res.status(400).json({
        "die with that": "googlezj",
    });
}
