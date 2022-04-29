import { appDataSource } from "../loaders";
import { Dealer } from "../models";

export class DealerOperation {
    private get source() {
        return appDataSource;
    }

    public get dealerRepo() {
        return this.source.getRepository(Dealer);
    }

    public async insertDealer(params: Partial<Dealer>) {
        const dealer = await this.dealerRepo.insert(params);
        return dealer;
    }

    public createDealer(params: Partial<Dealer>) {
        return this.dealerRepo.create(params);
    }

    public async updateDealer(params: Partial<Dealer>) {
        const dealer = await this.dealerRepo.save(params);
        return dealer;
    }
}

export default new DealerOperation();
