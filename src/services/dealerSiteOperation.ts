import { appDataSource } from "../loaders";
import { DealerSite } from "../models";

export class DealerOperation {
    private get source() {
        return appDataSource;
    }

    public get dealerSiteRepo() {
        return this.source.getRepository(DealerSite);
    }

    public async insertDealerSite(params: Partial<DealerSite>) {
        const dealerSite = await this.dealerSiteRepo.insert(params);
        return dealerSite;
    }

    public createDealerSite(params: Partial<DealerSite>) {
        return this.dealerSiteRepo.create(params);
    }

    public async updateDealerSite(params: Partial<DealerSite>) {
        const dealerSite = await this.dealerSiteRepo.save(params);
        return dealerSite;
    }
}

export default new DealerOperation();
