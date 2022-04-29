import { Request, Response } from "express";
import httpStatus from "http-status";
import { BaseEntity } from "typeorm";
import { BuyerOperation } from "../../services/buyerOperation";
import { DealerOperation } from "../../services/dealerOperation";
import { UserOperation } from "../../services/userOperation";
import { VendorOperation } from "../../services/vendorOperation";
import { __prod__ } from "../dev";
import idRemover from "./idRemover";

type Maker = UserOperation | DealerOperation | VendorOperation | BuyerOperation;

export const responseFuncGen =
    <T, extra>(operator: Maker, ...params: Array<string>) =>
    async (
        req: Request<any, any, Partial<T> & extra & { id: number }>,
        res: Response<{ message: string; data?: string }>
    ) => {
        const { id } = req.body;

        let results:
            | (InstanceType<typeof BaseEntity> & Record<string, any>)
            | null = null;

        try {
            if (operator instanceof BuyerOperation) {
                //
                results = await operator.buyerRepo.findOne({
                    where: { id },
                });
            } else if (operator instanceof UserOperation) {
                //
                results = await operator.userRepo.findOne({ where: { id } });
            } else if (operator instanceof DealerOperation) {
                //
                results = await operator.dealerRepo.findOne({ where: { id } });
            } else if (operator instanceof VendorOperation) {
                //
                results = await operator.vendorRepo.findOne({ where: { id } });
            }

            if (!results) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "bad request",
                });
            }
            idRemover.setBody = req.body;
            results = Object.assign(results, idRemover.removeId());
            await results.save();

            return res.status(httpStatus.OK).json({
                message: "successfuly updated",
            });
        } catch (err) {
            !__prod__ && console.log("err", err);

            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: "an error accured try again later",
            });
        }
    };
