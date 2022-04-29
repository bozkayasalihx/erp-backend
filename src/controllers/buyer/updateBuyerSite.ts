import { Request, Response } from "express";
import { IBuyerSite } from "./createBuyerSite";

export default async function updateBuyerSite(
    req: Request<any, any, Partial<IBuyerSite> & { id: number }>,
    res: Response<{ message: string; data?: string }>
) {
    //
}
