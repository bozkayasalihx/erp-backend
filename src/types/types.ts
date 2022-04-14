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
Routes.REGISTER;
