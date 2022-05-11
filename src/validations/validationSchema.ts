import Joi from "joi";
import { __prod__ } from "../scripts/dev";
import { UserTypes } from "../types/types";

const allowedTypes = ["SA", "VA", "V", "B", "BA", "D", "DA"];
export interface ILogin {
    email: string;
    password: string;
    //user_type: UserTypes;
    //tckn: string;
    //mobile: string;
}

export interface IRegister {
    username: string;
    email: string;
    password: string;
    user_type: UserTypes;
    tckn: string;
    mobile: string;
}

class ValidationSchema {
    public loginValidation() {
        return Joi.object<ILogin>({
            email: Joi.string().required().email(),
            password: Joi.string().required().min(5),
            //user_type: Joi.valid(...allowedTypes).required(),
            //mobile: Joi.string().required().min(10).max(11),
            //tckn: Joi.string().required().min(11).max(11),
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
            vendor_region_id: Joi.string().required(),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }

    public updateVendorValidation() {
        return Joi.object({
            id: Joi.number().required(),
            name: Joi.string().optional().min(3),
            tax_no: Joi.string().optional().min(3),
            vendor_region_id: Joi.string().optional(),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }

    public createVendorRegionValidation() {
        return Joi.object({
            name: Joi.string().required().min(2),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }

    public updateVendorRegionValidation() {
        return Joi.object({
            id: Joi.number().required(),
            name: Joi.string().optional().min(2),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }

    public createBuyerValidation() {
        return Joi.object({
            name: Joi.string().required().min(3),
            tax_no: Joi.number().required().min(3),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }

    public updateBuyerValidation() {
        return Joi.object({
            id: Joi.number().required(),
            name: Joi.string().optional().min(3),
            tax_no: Joi.number().optional().min(3),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }

    public createBuyerSiteValidation() {
        return Joi.object({
            name: Joi.string().required().min(3),
            buyer_id: Joi.number().required(),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }

    public updateBuyerSiteValidation() {
        return Joi.object({
            name: Joi.string().optional().min(3),
            id: Joi.number().required(),
            buyer_id: Joi.number().optional(),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }

    public createDealerValidation() {
        return Joi.object({
            name: Joi.string().required().min(3),
            tax_no: Joi.number().required().min(3),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }

    public updateDealerValidation() {
        return Joi.object({
            name: Joi.string().optional().min(3),
            tax_no: Joi.number().optional().min(3),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }

    public createDealerSiteValidation() {
        return Joi.object({
            name: Joi.string().required().min(3),
            dealer_id: Joi.number().required(),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }

    public updateDealerSiteValidation() {
        return Joi.object({
            name: Joi.string().optional().min(3),
            dealer_id: Joi.number().optional(),
            created_by: __prod__ && Joi.number().required(),
            updated_by: __prod__ && Joi.number().required(),
        });
    }
}

export default new ValidationSchema();
