import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserEntityRelationOperation } from "../../services";

export default async function getRelationController(
    req: Request,
    res: Response<{ message: string; data?: any }>
) {
    //

    const relId = req.body.relationId;

    try {
        const allRelation = await UserEntityRelationOperation.repo.find({
            where: { id: relId },
            relations: {
                buyer_site_ref_table: true,
                dealer_site_ref_table: true,
                vendor_ref_table: true,
                user: true,
            },
        });

        return res.status(httpStatus.OK).json({
            message: "succesful operation",
            data: allRelation,
        });
    } catch (err) {
        console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
