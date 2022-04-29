import { Request, Response } from "express";
import { IBuyerParams } from "./createBuyer";

export default async function updateBuyer(
    req: Request<any, any, Partial<IBuyerParams> & { id: number }>,
    res: Response<{ message: string; data?: string }>
) {
    //
}
