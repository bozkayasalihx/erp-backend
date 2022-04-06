import { Request, Response } from "express";
import { appDataSource } from "../bootstrap";
import { User } from "../models";

export default async function me(req: Request, res: Response) {
    // const userId = req.session.userId;
    // const user = await appDataSource
    //     .getRepository(User)
    //     .findOne({ where: { id: userId } });

    return res.status(400).json({
        "die with that": "googlezj",
    });
}
