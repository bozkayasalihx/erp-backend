import httpStatus from "http-status";
import { buyerOperation, buyerSiteOperation } from "../../services";
import {
    AttributeFields,
    OptionalDates,
    TypedRequest,
    TypedResponse,
} from "../../types";

export interface IBuyerSite extends AttributeFields, OptionalDates {
    name: string;
    buyerId: number;
}

export default async function buyerSite(
    req: TypedRequest<IBuyerSite>,
    res: TypedResponse
) {
    const { buyerId, name, ...attributes } = req.body;
    const { user } = req;
    try {
        const buyerSiteUser = await buyerSiteOperation.repo.findOne({
            where: { name },
        });

        const buyer = await buyerOperation.repo.findOne({
            where: { id: buyerId },
        });

        if (buyer) {
            if (buyerSiteUser) {
                buyerSiteUser.buyer = buyer;
                buyerSiteUser.created_by = user;
                buyerSiteUser.updated_by = user;
                await buyerSiteUser.save();
                return res.status(httpStatus.OK).json({
                    message: "succesfully updated",
                    data: buyerSiteUser,
                });
            }

            const bs = await buyerSiteOperation.insertBuyerSite({
                name,
                buyer,
                ...attributes,
                updated_by: user,
                created_by: user,
            });

            return res.status(httpStatus.OK).json({
                message: "succesfully created",
                data: bs,
            });
        }

        return res.status(httpStatus.BAD_REQUEST).json({
            message: "buyer id not found",
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
