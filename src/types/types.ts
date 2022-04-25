import * as models from "../models";

export interface IBaseParams {
    created_at: Date;
    update_at: Date;
    deleted_at: Date;
}

export interface GenericError {
    field: string;
    message: string;
}

export enum UserTypes {
    SITE_ADMIN = "SA",
    VENDOR = "V",
    VENDOR_ADMIN = "VA",
    BUYER = "B",
    BUYER_ADMIN = "BA",
    DEALER = "D",
    DEALER_ADMIN = "DA",
}

export const allModels = {
    ...models,
};

export enum FileStatusType {
    NEW = "N",
    VALIDATED = "V",
    REJECTED = "R",
    INTERFACED = "I",
    INVOICED = "S",
}

export enum FileRecordType {
    HEADER = "H",
    LINE = "L",
}

export enum LineStatusType {
    NEW = "N",
    ERROR = "E",
    SUCCESS = "S",
}
export enum InvoiceStatusType {
    NEW = "A",
    PENDING_APPROVAL = "B",
    APPROVED = "C",
    REJECTED = "D",
    CANCELLED = "E",
    PARTIALLY_PAID = "F",
    TOTALLY_PAID = "G",
}

export enum PaymentStatusType {
    NO_PAYMENT = "N",
    PARTIALLY_PAID = "P",
    FULLY_PAID = "C",
}
export enum PaymentType {
    DEPOSIT = "D",
    ADVANCE = "A",
    VINOV = "V",
    CREDIT_CARD = "CC",
    CASH = "C",
    KMH = "K",
}
export enum Currency {
    USD = "usd",
    EUR = "eur",
    TRY = "try",
}
export enum DepositStatusType {
    ENTERED = "E",
    PENDING_APPROVAL = "P",
    APPROVED = "A",
    REJECTED = "R",
}

export enum AdvanceType {
    CASH = "C",
    CREDIT_CARD = "CC",
    VINOV = "V",
}

export enum AdvanceStatusType {
    ENTERED = "E",
    PENDING_APPROVAL = "P",
    APPROVED = "A",
    REJECTED = "R",
}
