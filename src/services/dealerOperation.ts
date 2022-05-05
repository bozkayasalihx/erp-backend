import { appDataSource } from "../loaders";
import { Dealer } from "../models";

export class DealerOperation {
    private get source() {
        return appDataSource;
    }

    public get repo() {
        return this.source.getRepository(Dealer);
    }

    public async insertDealer(params: Partial<Dealer>) {
        const dealer = await this.repo.insert(params);
        return dealer;
    }

    public createDealer(params: Partial<Dealer>) {
        return this.repo.create(params);
    }

    public async updateDealer(params: Partial<Dealer>) {
        const dealer = await this.repo.save(params);
        return dealer;
    }
}

export default new DealerOperation();
