import { Request, Response } from "express";
import httpStatus from "http-status";
import { __prod__ } from "src/scripts/dev";
import dealerOperation from "src/services/dealerOperation";
import { IDealerSite } from "./createDealerSite";

export default async function updateDealerSite(
    req: Request<any, any, Partial<IDealerSite> & { id: number }>,
    res: Response<{ message: string; data?: string }>
) {
    const { id } = req.body;
    const user = req.user;
    try {
        const dealerSite = await dealerOperation.dealerSiteRepo.findOne({
            where: { id },
        });

        if (!dealerSite)
            return res.status(httpStatus.NOT_FOUND).json({
                message: "dealer site not found",
            });

        if (req.body.dealer_id) dealerSite.dealer_id = req.body.dealer_id;
        if (req.body.name) dealerSite.name = req.body.name;

        dealerSite.updated_by = user;

        await dealerOperation.updateDealerSite(dealerSite);

        return res.status(httpStatus.OK).json({
            message: "successfuly updated",
        });
    } catch (err) {
        !__prod__ && console.log("err", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured",
        });
    }
}
