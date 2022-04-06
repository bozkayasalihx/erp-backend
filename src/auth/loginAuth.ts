import { resolve } from "path";
import { IBaseParams } from "../types/types";

interface ILogin {
    username: string;
    password: string;
    email: string;
}

//:FIXME: make more sensiable structure to catch errors;
// {username: {...}, email: {...}, }
//            {reason: '...', }

/**
 * {username: {reason: 'username not valid length}, ...};
 * {email: {reason: 'email not matched to original one }}
 */

type IError<T extends string> = {
    [x in T]: string;
};

export default class LoginAuth {
    private loginParams: ILogin;
    private loginError: IError<keyof ILogin>;
    constructor(params: ILogin) {
        this.loginParams = params;
    }

    private get params() {
        return this.loginParams;
    }

    public validateEmail() {
        const email = this.params.email;
        // prettier-ignore
        const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "gi");

        const valid = emailRegex.test(email);
        return valid;
    }

    public validateUsername() {
        const usenrame = this.params.username;
        // prettier-ignore
        const userNameRegex = new RegExp("\w{4,}", "gi");

        return userNameRegex.test(usenrame);
    }

    public validatePassword() {
        //TODO: implement password validation
        return this.params.password;
    }
}
