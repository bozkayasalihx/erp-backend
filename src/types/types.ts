export interface IBaseParams {
    created_at: Date;
    update_at: Date;
    deleted_at: Date;
}

export interface GenericError {
    field: string;
    message: string;
}
