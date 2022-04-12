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
    SITE_ADMIN = 1,
    VENDOR = 6,
    VENDOR_ADMIN = 7,
    BUYER = 2,
    BUYER_ADMIN = 3,
    DEALER = 4,
    DEALER_ADMIN = 5,
}

export const allModels = {
    ...models,
};
