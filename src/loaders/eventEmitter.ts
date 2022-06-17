import { captureRejectionSymbol, EventEmitter } from "events";
import type User from "../models/User";

interface Inner {
    file_process_id: number;
    user: User;
}

interface IEvents {
    send_email: (params: {
        toEmail: string;
        subject: string;
        html: string;
    }) => void;
    process_invoiceInterface: (params: Inner, filePath?: string) => void;
    process_psi: (params: Inner, filePath?: string) => void;
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
        super({ captureRejections: true });
    }

    [captureRejectionSymbol](err: Error, event: any, ...args: any[]) {
        // eslint-disable-next-line no-console
        console.log("rejection happened", event, "with", err, ...args);
        this.destroy(err);
    }

    private destroy(err: Error) {
        // eslint-disable-next-line no-console
        console.log("err", err);
    }
}

const eventclass = new EmitterClass();
export default eventclass;
