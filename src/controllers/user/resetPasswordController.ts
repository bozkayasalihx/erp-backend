import httpStatus from "http-status";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import genHash from "../../scripts/utils/generateHash";
import { userOperation } from "../../services";
import { TypedRequest, TypedResponse } from "../../types";

interface IParams {
    token: string;
    newPassword: string;
}

export default async function resetPasswordController(
    req: TypedRequest<IParams>,
    res: TypedResponse
) {
    const { newPassword, token } = req.body;

    try {
        const decoded = jwt.verify(
            token,
            process.env.FORGOT_PASSWORD_SECRET_KEY
        ) as jwt.JwtPayload;

        const user = await userOperation.repo.findOne({
            where: { id: decoded.userId },
        });
        if (!user) {
            return res.status(httpStatus.OK).json({
                message: "true",
            });
        }

        user.password = await genHash.gen(newPassword);
        await user.save();

        return res.status(httpStatus.OK).json({
            message: "operation successful",
        });
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "expired token",
            });
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured try again later",
        });
    }
}
