import Joi from "joi";
import { IUserEntityRelation } from "../controllers/relations/createUserEntityRelation";
import { UserTypes } from "../types/types";

const allowedTypes = ["SA", "VA", "V", "B", "BA", "D", "DA"];
export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister {
    username: string;
    email: string;
    password: string;
    user_type: UserTypes;
    tckn: string;
    mobile: string;
}

export interface Options {
    attribute1: string;
    attribute2: string;
    attribute3: string;
    attribute4: string;
    attribute5: string;
}

const options = {
    attribute1: Joi.string().optional(),
    attribute2: Joi.string().optional(),
    attribute3: Joi.string().optional(),
    attribute4: Joi.string().optional(),
    attribute5: Joi.string().optional(),
};

class ValidationSchema {
    public loginValidation() {
        return Joi.object<ILogin>({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(5),
        });
    }
    public registerValidation() {
        return Joi.object<IRegister>({
            username: Joi.string().min(3),
            email: Joi.string().required().email(),
            password: Joi.string().required().min(5),
            user_type: Joi.valid(...allowedTypes).required(),
            mobile: Joi.string().required().min(10).max(11),
            tckn: Joi.string().required().min(11).max(11),
        });
    }

    public resetPasswordValidation() {
        return Joi.object<{ email: string }>({
            email: Joi.string().required().email(),
        });
    }

    public createVendorValidation() {
        return Joi.object({
            name: Joi.string().required().min(3),
            tax_no: Joi.string().required().min(3),
            ...options,
        });
    }

    public updateVendorValidation() {
        return Joi.object({
            id: Joi.number().required(),
            name: Joi.string().optional().min(3),
            tax_no: Joi.string().optional().min(3),
            ...options,
        });
    }

    public createVendorRegionValidation() {
        return Joi.object({
            name: Joi.string().required().min(2),
            vendor_id: Joi.number().required(),
            ...options,
        });
    }

    public updateVendorRegionValidation() {
        return Joi.object({
            id: Joi.number().required(),
            name: Joi.string().optional().min(2),
            vendor_id: Joi.number().optional(),
            ...options,
        });
    }

    public createBuyerValidation() {
        return Joi.object({
            name: Joi.string().required().min(3),
            tax_no: Joi.number().required().min(3),
            ...options,
        });
    }

    public updateBuyerValidation() {
        return Joi.object({
            id: Joi.number().required(),
            name: Joi.string().optional().min(3),
            tax_no: Joi.number().optional().min(3),
            ...options,
        });
    }

    public createBuyerSiteValidation() {
        return Joi.object({
            name: Joi.string().required().min(3),
            buyer_id: Joi.number().required(),
            ...options,
        });
    }

    public updateBuyerSiteValidation() {
        return Joi.object({
            name: Joi.string().optional().min(3),
            id: Joi.number().required(),
            buyer_id: Joi.number().optional(),
            ...options,
        });
    }

    public createDealerValidation() {
        return Joi.object({
            name: Joi.string().required().min(3),
            tax_no: Joi.number().required().min(3),
            ...options,
        });
    }

    public updateDealerValidation() {
        return Joi.object({
            name: Joi.string().optional().min(3),
            tax_no: Joi.number().optional().min(3),
            ...options,
        });
    }

    public createDealerSiteValidation() {
        return Joi.object({
            name: Joi.string().required().min(3),
            dealer_id: Joi.number().required(),
            ...options,
        });
    }

    public updateDealerSiteValidation() {
        return Joi.object({
            name: Joi.string().optional().min(3),
            dealer_id: Joi.number().optional(),
            ...options,
        });
    }

    public createVdsValidation() {
        return Joi.object({
            vendor_id: Joi.number().required(),
            dealer_site_id: Joi.number().required(),
            description: Joi.string().optional(),
        });
    }

    public createVdsbsValidation() {
        return Joi.object({
            vds_rltn_id: Joi.number().required(),
            buyer_site_id: Joi.number().required(),
            description: Joi.string().optional(),
        });
    }
    public createPasswordValidation() {
        return Joi.object<{ token: string; newPassword: string }>({
            token: Joi.string().required().min(10),
            newPassword: Joi.string().required().min(5),
        });
    }
    public createUserEntityValidation() {
        return Joi.object<IUserEntityRelation>({
            buyer_site_table_ref: Joi.number().optional(),
            dealer_site_table_ref: Joi.number().optional(),
            vendor_table_ref: Joi.number().optional(),
            description: Joi.string().optional(),
            user_id: Joi.number().required(),
        });
    }
}

export default new ValidationSchema();
