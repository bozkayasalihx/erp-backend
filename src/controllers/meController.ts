import { Request, Response } from "express";

export default async function me(req: Request, res: Response) {
    return res.send(req.user);
}
