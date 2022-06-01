import {
    buyerSiteOperation,
    dealerSiteOperation,
    vendorOperation,
} from "../../services";
import { UserTypes } from "../../types/types";

export function isContain(params: Record<string, any>) {
    const hashMap = {};
    const error: { valid: boolean } = { valid: true };
    const validOne: { [x: string]: number } = {};
    let i = 0;
    for (const [key, value] of Object.entries(params)) {
        hashMap[key] = value;
        if (value) {
            i++;
            validOne[key] = value;
        }
        if (!(key in hashMap)) hashMap[key] = value;
    }
    if (i > 1 || i === 0) error["valid"] = false;
    i = 0;
    return {
        hashMap,
        error,
        validOne,
    };
}

enum Types {
    VENDOR = "vendor",
    BUYER_SITE = "buyer_site",
    DEALER_SITE = "dealer_site",
}
export async function makeSure(obj: { [x: string]: number }) {
    const key = Object.keys(obj)[0];

    const type = key.split("_table")[0];
    switch (type) {
        case Types.VENDOR: {
            const data = await vendorOperation.repo.findOne({
                where: { id: obj[key] },
            });

            if (data) return true;
            return false;
        }

        case Types.DEALER_SITE: {
            const data = await dealerSiteOperation.repo.findOne({
                where: { id: obj[key] },
            });

            if (data) return true;
            return false;
        }

        case Types.BUYER_SITE: {
            const data = await buyerSiteOperation.repo.findOne({
                where: { id: obj[key] },
            });

            if (data) return true;
            return false;
        }
        default: {
            return false;
        }
    }
}

export function hasAccess(obj: { [x: string]: number }, user_type: string) {
    const entity_type = Object.keys(obj)[0].split("_table")[0];

    switch (entity_type) {
        case Types.VENDOR: {
            if (
                user_type === UserTypes.VENDOR ||
                user_type === UserTypes.VENDOR_ADMIN
            ) {
                return true;
            }
            return false;
        }
        case Types.DEALER_SITE: {
            if (
                user_type === UserTypes.DEALER ||
                user_type === UserTypes.DEALER_ADMIN
            ) {
                return true;
            }
            return false;
        }
        case Types.BUYER_SITE: {
            if (
                user_type === UserTypes.BUYER ||
                user_type === UserTypes.BUYER_ADMIN
            ) {
                return true;
            }
            return false;
        }
        default: {
            return false;
        }
    }
    return false;
}
