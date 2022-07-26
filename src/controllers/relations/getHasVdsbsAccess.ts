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
    const results = await userVdsbsAccess.tableRouter();

    // eslint-disable-next-line no-console
    console.log("results", results);

    return res.status(httpStatus.OK).json({
        message: "everythings is okay",
    });
}
