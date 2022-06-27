import { NextFunction } from "express";
import httpStatus from "http-status";
import { TypedRequest, TypedResponse, UserTypes } from "../types";
import { accesableRoute } from "../types/routePath";

export default function permission(
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
) {
    // const fullUrl = `${req.protocol}://${req.headers.host}${req.url}`;
    const { userType } = req.user;
    const { url } = req;
    const routeType = url.split("/").filter(Boolean)[1];
    const valid = Object.values(UserTypes).indexOf(userType) !== -1;

    if (!valid) {
        return res.status(httpStatus.UNAUTHORIZED).json({
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

        case UserTypes.BUYER: {
            for (const route of accesableRoute.get(UserTypes.BUYER)!) {
                if (routeType === route) {
                    return next();
                }
            }

            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }

        case UserTypes.DEALER: {
            for (const route of accesableRoute.get(UserTypes.DEALER)!) {
                if (routeType === route) {
                    return next();
                }
            }

            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }

        case UserTypes.VENDOR: {
            for (const route of accesableRoute.get(UserTypes.VENDOR)!) {
                if (routeType === route) {
                    return next();
                }
            }

            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }
        case UserTypes.SITE_ADMIN: {
            return next();
        }
        default: {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "no such as user type",
            });
        }
    }
}
