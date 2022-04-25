import Joi from "joi";
import { UserTypes } from "../types/types";

const allowedTypes = ["VA", "V", "B", "BA", "D", "DA"];
export interface ILogin {
    email: string;
    password: string;
    user_type: UserTypes;
    tckn: string;
    mobile: string;
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
            user_type: Joi.valid(...allowedTypes).required(),
            mobile: Joi.string().required().min(10).max(11),
            tckn: Joi.string().required().min(11).max(11),
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

    public vendorValidation() {
        return Joi.object({
            name: Joi.string().required().min(3),
            tax_no: Joi.number().required().min(3),
            vendor_region_id: Joi.number().required(),
        });
    }

    public vendorRegionValidation() {
        return Joi.object({
            name: Joi.string().required().min(2),
        });
    }
}

export default new ValidationSchema();
