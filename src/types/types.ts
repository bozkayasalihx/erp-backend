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

export enum Routes {
    REGISTER = "/register",
    LOGIN = "/login",
    ME = "/me",
}

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
