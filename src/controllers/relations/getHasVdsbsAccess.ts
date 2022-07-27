import httpStatus from "http-status";
import { userVdsbsAccess } from "../../services";
import { TypedRequest, TypedResponse } from "../../types";

interface HasVdsbsAccess {
    userId: number;
}

export default async function getHasVdsbsAccess(
    req: TypedRequest<HasVdsbsAccess>,
    res: TypedResponse
) {
    const { userId } = req.body;
    userVdsbsAccess.setUserId = userId;
    try {
        const results = await userVdsbsAccess.tableRouter();

        return res.status(httpStatus.OK).json({
            message: "everythings is okay",
            data: results,
        });
    } catch (err) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "bad request",
        });
    }
}
