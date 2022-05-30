import { captureRejectionSymbol, EventEmitter } from "events";

interface IEvents {
    send_email: (params: {
        toEmail: string;
        subject: string;
        html: string;
    }) => void;
    process_invoiceInterface: ({ file_process_id: number }) => void;
    process_psi: ({ file_process_id: number }) => void;
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
        console.log("rejection happened", event, "with", err, ...args);
        this.destroy(err);
    }

    private destroy(err: Error) {
        console.log("err", err);
    }
}

const eventclass = new EmitterClass();
export default eventclass;
