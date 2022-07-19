import httpStatus from "http-status";
import { dealerSiteOperation } from "../../services";
import dealerOperation from "../../services/dealerOperation";
import {
    AttributeFields,
    OptionalDates,
    TypedRequest,
    TypedResponse,
} from "../../types";

export interface IDealerSite extends AttributeFields, OptionalDates {
    name: string;
    dealerId: number;
}

export default async function dealerSite(
    req: TypedRequest<IDealerSite>,
    res: TypedResponse
) {
    const { dealerId, name, ...attributes } = req.body;
    const { user } = req;

    try {
        const dealer = await dealerOperation.repo.findOne({
            where: { id: dealerId },
        });

        if (dealer) {
            await dealerSiteOperation.insertDealerSite({
                name,
                dealerId,
                ...attributes,
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
        if (err?.detail?.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "this record already exits",
            });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
