import { Request, Response } from "express";
import httpStatus from "http-status";
import { isContain } from "../../scripts/utils/isContains";
import userEntityRelationOperation from "../../services/userEntityRelationOperation";
import userOperation from "../../services/userOperation";

export interface IUserEntityRelation {
    user_id: number;
    description: string;
    vendor_table_ref?: number;
    buyer_site_table_ref: number;
    dealer_site_table_ref?: number;
}

export default async function createUserEntityRelation(
    req: Request<any, any, IUserEntityRelation>,
    res: Response
) {
    try {
        const { description, user_id, ...ids } = req.body;

        const user = await userOperation.repo.findOne({
            where: { id: user_id },
        });
        if (!user)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "not found",
            });

        if (!Object.keys(ids).length)
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "must container ref ids",
            });
        const results = isContain(ids);

        if (results.size > 1) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "must be only one column of id defined",
            });
        }

        const [key, value] = Array.from(results)[0];

        const userEntity = await userEntityRelationOperation.insertUE({
            description,
            user,
            updated_by: user,
            created_by: user,
            [key]: value,
        });

        return res.status(httpStatus.OK).json({
            message: "ok",
            data: userEntity,
        });
    } catch (err) {
        console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
