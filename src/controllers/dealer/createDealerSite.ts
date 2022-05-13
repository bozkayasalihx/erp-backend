import { Request, Response } from "express";
import httpStatus from "http-status";
import { dealerSiteOperation } from "../../services";
import dealerOperation from "../../services/dealerOperation";

export interface IDealerSite {
    name: string;
    dealer_id: number;
}

export default async function dealerSite(
    req: Request<any, any, IDealerSite>,
    res: Response
) {
    const { dealer_id, name } = req.body;
    const user = req.user;

    try {
        const dealer = await dealerOperation.repo.findOne({
            where: { id: dealer_id },
        });

        if (dealer) {
            await dealerSiteOperation.insertDealerSite({
                name,
                dealer_id,
                updated_by: user,
                created_by: user,
            });

            return res.status(httpStatus.OK).json({
                message: "successfuly created",
            });
        }
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "some entered inputs not valid",
        });
    } catch (err) {
        console.log("err", err);

        if (err?.detail?.includes("already exists")) {
            //FIXME: make already exists error specific class;
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "this record already exits",
            });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
