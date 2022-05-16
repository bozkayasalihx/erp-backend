import { EventEmitter } from "events";

interface IEvents {
    send_email: (params: {
        toEmail: string;
        subject: string;
        html: string;
    }) => void;
}

declare interface EmitterClass {
    on<U extends keyof IEvents>(event: U, listener: IEvents[U]): this;
    emit<U extends keyof IEvents>(
        event: U,
        ...args: Parameters<IEvents[U]>
    ): boolean;
}

class EmitterClass extends EventEmitter {
    constructor() {
        super();
    }
}

const eventclass = new EmitterClass();
export default eventclass;
