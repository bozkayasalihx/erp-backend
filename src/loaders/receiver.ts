import { Publisher, Subscriber } from "zeromq";
import { Queue } from "./queue";

export class Main {
    private address: string;
    private publisher = new Publisher();
    private worker = new Subscriber();
    constructor(address: string) {
        this.address = address;
    }

    private setQueue() {
        const queue = new Queue(this.publisher);
        queue.send("sailh");
    }

    private async setUpPublisher() {
        await this.publisher.bind(this.address);
    }

    private async setUpSubs() {
        this.worker.connect(this.address);
    }

    private async listenMsg() {
        const subs = this.worker;
        for await (const [msg] of subs) {
            if (!msg.length) subs.close();
            else {
                // console.log("received", msg);
            }
        }
    }

    public async processQueue() {
        this.setQueue();
        await this.setUpPublisher();
        await this.setUpSubs();
        await this.listenMsg();
    }
}
