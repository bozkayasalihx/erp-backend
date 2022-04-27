import { DataSource } from "typeorm";
import { appDataSource } from "../loaders";
import { Dealer, DealerSite } from "../models";

class DealerOperation {
    private source: DataSource;

    constructor() {
        this.source = appDataSource;
    }
    public get dealerRepo() {
        return this.source.getRepository(Dealer);
    }

    public get dealerSiteRepo() {
        return this.source.getRepository(DealerSite);
    }
    public async insertDealer(params: Partial<Dealer>) {
        const dealer = await this.dealerRepo.insert(params);
        return dealer;
    }

    public async insertDealerSite(params: Partial<DealerSite>) {
        const dealerSite = await this.dealerSiteRepo.insert(params);
        return dealerSite;
    }

    public createDealer(params: Partial<Dealer>) {
        return this.dealerRepo.create(params);
    }

    public createDealerSite(params: Partial<DealerSite>) {
        return this.dealerSiteRepo.create(params);
    }

    public async updateDealer(params: Partial<Dealer>) {
        const dealer = await this.dealerRepo.save(params);
        return dealer;
    }

    public async updateDealerSite(params: Partial<DealerSite>) {
        const dealerSite = await this.dealerSiteRepo.save(params);
        return dealerSite;
    }
}

export default new DealerOperation();
