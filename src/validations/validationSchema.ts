import Joi from "joi";
import { IAdvance } from "../controllers/advance/createAdvance";
import { IBuyer } from "../controllers/buyer/createBuyer";
import { IBuyerSite } from "../controllers/buyer/createBuyerSite";
import { IDealer } from "../controllers/dealer/createDealer";
import { IDealerSite } from "../controllers/dealer/createDealerSite";
import { IDeposit } from "../controllers/deposit/createDeposit";
import { IPaymentSchedule } from "../controllers/payment/createPayment";
import { IDealerRouteUser } from "../controllers/relations/createDealerRouteUser";
import { IUserEntityRelation } from "../controllers/relations/createUserEntityRelation";
import { IVDSBSRelations } from "../controllers/relations/createVdsbsRelations";
import { IVdsRelations } from "../controllers/relations/createVdsRelations";
import { IVendor } from "../controllers/vendor/createVendor";
import { IVendorRegion } from "../controllers/vendor/createVendorRegion";
import { UpdateVendor } from "../controllers/vendor/updateVendor";
import { UpdateVendorRegion } from "../controllers/vendor/updateVendorRegion";
import {
    AdvanceStatusType,
    AdvanceType,
    Currency,
    DepositStatusType,
    InvoiceStatusType,
    PaymentType,
    UserTypes,
} from "../types";

export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister {
    username: string;
    email: string;
    password: string;
    userType: UserTypes;
    tckn: string;
    mobile: string;
    startDate: Date;
    endDate: Date;
}

export interface Options {
    attribute1: string;
    attribute2: string;
    attribute3: string;
    attribute4: string;
    attribute5: string;
}

const dateOptions = {
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
};

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
            userType: Joi.valid(...Object.values(UserTypes)).required(),
            mobile: Joi.string().required().min(10).max(11),
            tckn: Joi.string().required().min(11).max(11),
            ...dateOptions,
        });
    }

    public resetPasswordValidation() {
        return Joi.object<{ email: string }>({
            email: Joi.string().required().email(),
        });
    }

    public createVendorValidation() {
        return Joi.object<IVendor>({
            name: Joi.string().required().min(3),
            taxNo: Joi.string().required().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public updateVendorValidation() {
        return Joi.object<UpdateVendor>({
            id: Joi.number().required(),
            name: Joi.string().optional().min(3),
            taxNo: Joi.string().optional().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public createVendorRegionValidation() {
        return Joi.object<IVendorRegion>({
            name: Joi.string().required().min(2),
            vendorId: Joi.number().required(),
            ...options,
            ...dateOptions,
        });
    }

    public updateVendorRegionValidation() {
        return Joi.object<UpdateVendorRegion>({
            id: Joi.number().required(),
            name: Joi.string().optional().min(2),
            vendorId: Joi.number().optional(),
            ...options,
            ...dateOptions,
        });
    }

    public createBuyerValidation() {
        return Joi.object<IBuyer>({
            name: Joi.string().required().min(3),
            taxNo: Joi.number().required().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public updateBuyerValidation() {
        return Joi.object({
            id: Joi.number().required(),
            name: Joi.string().optional().min(3),
            taxNo: Joi.number().optional().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public createBuyerSiteValidation() {
        return Joi.object<IBuyerSite>({
            name: Joi.string().required().min(3),
            buyerId: Joi.number().required(),
            ...options,
            ...dateOptions,
        });
    }

    public updateBuyerSiteValidation() {
        return Joi.object({
            name: Joi.string().optional().min(3),
            id: Joi.number().required(),
            buyerId: Joi.number().optional(),
            ...options,
            ...dateOptions,
        });
    }

    public createDealerValidation() {
        return Joi.object<IDealer>({
            name: Joi.string().required().min(3),
            taxNo: Joi.number().required().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public updateDealerValidation() {
        return Joi.object({
            name: Joi.string().optional().min(3),
            taxNo: Joi.number().optional().min(3),
            ...options,
            ...dateOptions,
        });
    }

    public createDealerSiteValidation() {
        return Joi.object<IDealerSite>({
            name: Joi.string().required().min(3),
            dealerId: Joi.number().required(),
            ...options,
            ...dateOptions,
        });
    }

    public updateDealerSiteValidation() {
        return Joi.object({
            name: Joi.string().optional().min(3),
            dealerId: Joi.number().optional(),
            ...options,
            ...dateOptions,
        });
    }

    public createVdsValidation() {
        return Joi.object<IVdsRelations>({
            vendorId: Joi.number().required(),
            dealerSiteId: Joi.number().required(),
            description: Joi.string().optional(),
            ...dateOptions,
        });
    }

    public createVdsbsValidation() {
        return Joi.object<IVDSBSRelations>({
            vdsRltnId: Joi.number().required(),
            buyerSiteId: Joi.number().required(),
            description: Joi.string().optional(),
            ...dateOptions,
        });
    }

    public createPasswordValidation() {
        return Joi.object<{ token: string; newPassword: string }>({
            token: Joi.string().required().min(10),
            newPassword: Joi.string().required().min(5),
            ...dateOptions,
        });
    }

    public createUserEntityValidation() {
        return Joi.object<IUserEntityRelation>({
            buyerSiteTableRef: Joi.alternatives()
                .try(Joi.valid(null), Joi.number())
                .required(),
            dealerSiteTableRef: Joi.alternatives()
                .try(Joi.valid(null), Joi.number())
                .required(),
            vendorTableRef: Joi.alternatives()
                .try(Joi.valid(null), Joi.number())
                .required(),
            description: Joi.string().optional(),
            userId: Joi.number().required(),
            ...dateOptions,
        });
    }

    public createDealerRouteUser() {
        return Joi.object<IDealerRouteUser>({
            description: Joi.string().optional(),
            userId: Joi.number().required(),
            vdsbsId: Joi.number().required(),
            ...dateOptions,
        });
    }

    public createDeposit() {
        return Joi.object<IDeposit>({
            amount: Joi.number().required(),
            currency: Joi.valid(...Object.values(Currency)).required(),
            status: Joi.valid(...Object.values(DepositStatusType)).required(),
            approvalDate: Joi.date().required(),
            vdsbsId: Joi.number().required(),
            ...dateOptions,
        });
    }

    public createAdvance() {
        return Joi.object<IAdvance>({
            advanceType: Joi.valid(...Object.values(AdvanceType)).required(),
            amount: Joi.number().required(),
            currency: Joi.valid(...Object.values(Currency)).required(),
            vdsbsId: Joi.number().required(),
            status: Joi.valid(...Object.values(AdvanceStatusType)).required(),
            approvalDate: Joi.date().required(),
            ...dateOptions,
        });
    }

    public createPaymentSchedule() {
        return Joi.object<IPaymentSchedule>({
            currency: Joi.valid(...Object.values(Currency)).optional(),
            remainedAmount: Joi.number().required(),
            effectiveDate: Joi.date().required(),
            invoicedStatus: Joi.valid(
                ...Object.values(InvoiceStatusType)
            ).optional(),
            originalAmount: Joi.number().required(),
            paymentType: Joi.valid(...Object.values(PaymentType)).optional(),
            referenceId: Joi.number().required(),
            vdsbsId: Joi.number().required(),
            ...dateOptions,
        });
    }
}

export default new ValidationSchema();
