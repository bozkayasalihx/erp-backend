import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { accesableRoute } from "../types/routePath";
import { UserTypes } from "../types/types";

export default function permission(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const fullUrl = `${req.protocol}://${req.headers.host}${req.url}`;
    const userType = req.user.user_type;
    const url = req.url;
    const routeType = url.split("/").filter(Boolean)[1];
    const enumArray = Object.values(UserTypes);
    const valid = enumArray.indexOf(userType) !== -1;

    if (!valid) {
        res.status(httpStatus.UNAUTHORIZED).json({
            message: "not autorizated",
        });
    }

    switch (userType) {
        case UserTypes.BUYER_ADMIN: {
            for (const route of accesableRoute.get(UserTypes.BUYER_ADMIN)!) {
                if (routeType === route) {
                    return next();
                }
            }
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }

        case UserTypes.DEALER_ADMIN: {
            for (const route of accesableRoute.get(UserTypes.DEALER_ADMIN)!) {
                if (routeType === route) {
                    return next();
                }
            }
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }

        case UserTypes.VENDOR_ADMIN: {
            for (const route of accesableRoute.get(UserTypes.VENDOR_ADMIN)!) {
                if (routeType === route) {
                    return next();
                }
            }
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }
        default: {
            return next();
        }
    }
}
