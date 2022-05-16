import { Request, Response } from "express";
import httpStatus from "http-status";
import decoder from "../../scripts/utils/decoder";
import revokeRefreshToken from "../../scripts/utils/revokeRefreshToken";
import { userOperation } from "../../services";

export default async function me(req: Request, res: Response) {
    const user = req.user;
    const refreshToken = req.refreshToken;
    decoder.setValue(refreshToken);
    const { userId, tokenVersion } = decoder.decode();

    const refreshUser = await userOperation.repo.findOne({
        where: { id: userId },
    });

    if (!refreshUser) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "unauthorizated user",
        });
    }

    if (
        user.username !== refreshUser.username ||
        user.password !== refreshUser.password
    ) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "unauthorizated attempt",
        });
    }

    await revokeRefreshToken(user.id);

    return res.status(httpStatus.OK).json({
        message: "operation succesful",
        data: {
            username: user.username,
            user_type: user.user_type,
            id: user.id,
        },
    });
}
