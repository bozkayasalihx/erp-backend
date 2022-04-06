import Joi from "joi";

export interface ILogin {
    username: string;
    email: string;
    password: string;
}

class Validation {
    public loginValidation() {
        return Joi.object<ILogin>({
            email: Joi.string().required().email(),
            username: Joi.string().required().min(5),
            password: Joi.string().required().min(5),
        });
    }
}

export default new Validation();
