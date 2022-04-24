import { ValidationErrorItem } from "joi";

export function errorSlugify(error: Array<ValidationErrorItem>) {
    return error
        .map((detail) => {
            return detail.message;
        })
        .join(", ");
}
