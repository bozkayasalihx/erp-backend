import { Request, Response } from "express";
import httpStatus from "http-status";
import { BuyerOperation } from "../../services/buyerOperation";
import { BuyerSiteOperation } from "../../services/buyerSiteOperation";
import { DealerOperation } from "../../services/dealerOperation";
import { DealerSiteOperation } from "../../services/dealerSiteOperation";
import { UserOperation } from "../../services/userOperation";
import { VendorOperation } from "../../services/vendorOperation";
import { __prod__ } from "../dev";

type Maker =
    | UserOperation
    | DealerOperation
    | VendorOperation
    | BuyerOperation
    | BuyerSiteOperation
    | DealerSiteOperation;

type Maybe<T> = Promise<T> | T;
type Callback<T> = (body: T) => any;

export const responseFuncGen =
    <T>(operator: Maker, cb: Callback<Partial<T> & { id: number }>) =>
    async (
        req: Request<any, any, Partial<T> & { id: number }>,
        res: Response<{ message: string; data?: string }>
    ) => {
        try {
            const user = req.user;
            const results = await cb(req.body);
            console.log("resutsl", results);
            if (!results)
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "bad request",
                });

            results.updated_by = user;
            await results.save();

            return res.status(httpStatus.OK).json({
                message: "successfully updated",
            });
        } catch (err) {
            !__prod__ && console.log("err", err);

            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: "an error accured try again later",
            });
        }
    };
