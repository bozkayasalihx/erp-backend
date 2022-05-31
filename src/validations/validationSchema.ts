import Joi from "joi";
import { IAdvance } from "../controllers/advance/createAdvance";
import { IDeposit } from "../controllers/deposit/createDeposit";
import { IInvoice } from "../controllers/invoice/createInvoice";
import { IInvoiceLine } from "../controllers/invoice/createInvoiceLine";
import { IPaymentSchedule } from "../controllers/payment/createPayment";
import { IDealerRouteUser } from "../controllers/relations/createDealerRouteUser";
import { IUserEntityRelation } from "../controllers/relations/createUserEntityRelation";
import {
    AdvanceStatusType,
    AdvanceType,
    Currency,
    DepositStatusType,
    InvoiceStatusType,
    PaymentType,
    UserTypes,
} from "../types/types";

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
    start_date: Date;
    end_date: Date;
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
            user_type: Joi.valid(...Object.values(UserTypes)).required(),
            mobile: Joi.string().required().min(10).max(11),
            tckn: Joi.string().required().min(11).max(11),
            start_date: Joi.date().optional(),
            end_date: Joi.date().optional(),
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

    public createDealerRouteUser() {
        return Joi.object<IDealerRouteUser>({
            description: Joi.string().optional(),
            user_id: Joi.number().required(),
            vdsbs_id: Joi.number().required(),
        });
    }
    public createDeposit() {
        return Joi.object<IDeposit>({
            amount: Joi.number().required(),
            currency: Joi.valid(...Object.values(Currency)).required(),
            status: Joi.valid(...Object.values(DepositStatusType)).required(),
            approval_date: Joi.date().required(),
            vdsbs_id: Joi.number().required(),
        });
    }

    public createAdvance() {
        return Joi.object<IAdvance>({
            advance_type: Joi.valid(...Object.values(AdvanceType)).required(),
            amount: Joi.number().required(),
            currency: Joi.valid(...Object.values(Currency)).required(),
            vdsbs_id: Joi.number().required(),
            status: Joi.valid(...Object.values(AdvanceStatusType)).required(),
            approvalDate: Joi.date().required(),
        });
    }

    public createInvoice() {
        return Joi.object<IInvoice>({
            currency: Joi.valid(...Object.values(Currency)).required(),
            invoice_no: Joi.string().required().min(30).max(30).required(),
            invoice_date: Joi.date().required(),
            amount: Joi.number().required(),
            status: Joi.valid(...Object.values(InvoiceStatusType)).required(),
            ref_file_id: Joi.number().required(),
            due_date: Joi.date().required(),
            vdsbs_id: Joi.number().required(),
            ...options,
        });
    }

    public createInvoiceLine() {
        return Joi.object<IInvoiceLine>({
            amount: Joi.number().required(),
            currency: Joi.valid(...Object.values(Currency)).required(),
            invoice_id: Joi.number().required(),
            item_description: Joi.string().optional(),
            item_quantity: Joi.number().required(),
            item_uom: Joi.string().required(),
            line_no: Joi.number().required(),
        });
    }
    public createPaymentSchedule() {
        return Joi.object<IPaymentSchedule>({
            currency: Joi.valid(...Object.values(Currency)).optional(),
            remained_amount: Joi.number().required(),
            effective_date: Joi.date().required(),
            invoiced_status: Joi.valid(
                ...Object.values(InvoiceStatusType)
            ).optional(),
            original_amount: Joi.number().required(),
            payment_type: Joi.valid(...Object.values(PaymentType)).optional(),
            reference_id: Joi.number().required(),
            vdsbs_id: Joi.number().required(),
        });
    }
}

export default new ValidationSchema();
