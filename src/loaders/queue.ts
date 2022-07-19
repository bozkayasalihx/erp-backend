import { Publisher } from "zeromq";

export class Queue {
    private queue: any[] = [];

    private socket: Publisher;

    private max: number;

    private sending = false;

    constructor(socket: Publisher, max = 100) {
        this.max = max;
        this.socket = socket;
    }

    public send(msg: any) {
        if (this.queue.length > this.max) {
            throw new Error("Quee is full");
        }
        this.queue.push(msg);
        this.trySend();
    }

    private async trySend() {
        if (this.sending) return;

        this.sending = true;
        const queue: Array<Promise<any>> = [];
        while (this.queue.length) {
            queue.push(this.socket.send(this.queue.shift()));
        }

        await Promise.all(queue);

        this.sending = false;
    }
}
