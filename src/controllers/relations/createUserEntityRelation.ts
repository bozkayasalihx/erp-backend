import { Request, Response } from "express";
import httpStatus from "http-status";
import { hasAccess, isContain, makeSure } from "../../scripts/utils/isContains";
import userEntityRelationOperation from "../../services/userEntityRelationOperation";
import userOperation from "../../services/userOperation";
import { OptionalDates } from "../../types/types";

export interface IUserEntityRelation extends OptionalDates {
    user_id: number;
    description: string;
    vendor_table_ref?: number;
    buyer_site_table_ref?: number;
    dealer_site_table_ref?: number;
}

export default async function createUserEntityRelation(
    req: Request<any, any, IUserEntityRelation>,
    res: Response
) {
    try {
        const { description, user_id, end_date, start_date, ...ids } = req.body;

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
        const { error, hashMap, validOne } = isContain(ids);
        if (!error.valid)
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "more than one or zero nonnullable field not allowed",
            });

        const valid = await makeSure(validOne);

        if (!valid)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "not found",
            });

        const accessRight = hasAccess(validOne, user.user_type);

        if (!accessRight) {
            return res.status(httpStatus.FORBIDDEN).json({
                message: "user_type has no access to create data",
            });
        }

        const data = await userEntityRelationOperation.repo
            .createQueryBuilder("uer")
            .where(
                `${Object.keys(validOne)[0]}_id = ${
                    Object.values(validOne)[0]
                } AND user_id = ${user_id}`
            )
            .select("1")
            .execute();

        if (data.length)
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "already exists",
            });

        await userEntityRelationOperation.insertUE({
            description,
            user,
            updated_by: req.user,
            created_by: req.user,
            start_date,
            end_date,
            ...hashMap,
        });

        return res.status(httpStatus.OK).json({
            message: "operation succesful",
        });
    } catch (err) {
        console.log("err", err);
        if (err?.detail?.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "already exists",
            });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
