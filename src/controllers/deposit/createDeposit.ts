import httpStatus from "http-status";
import {
    depositOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import {
    Currency,
    DepositStatusType,
    TypedRequest,
    TypedResponse,
} from "../../types";

export interface IDeposit {
    amount: number;
    currency: Currency;
    status: DepositStatusType;
    approvalDate: Date;
    vdsbsId: number;
}

export default async function createDeposit(
    req: TypedRequest<IDeposit>,
    res: TypedResponse
) {
    //
    const { user } = req;
    const { amount, approvalDate, currency, status, vdsbsId } = req.body;

    try {
        const vdsbs = await vendorToDealerSiteToBuyerSiteOperation.repo.findOne(
            {
                where: { id: vdsbsId },
            }
        );

        if (!vdsbs) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "not found",
            });
        }

        await depositOperation.insert({
            amount,
            approvalDate,
            currency,
            status,
            created_by: user,
            updated_by: user,
            vdsbs,
        });

        return res.status(httpStatus.CREATED).json({
            message: "operation successful",
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
