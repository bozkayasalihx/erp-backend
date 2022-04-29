import { appDataSource } from "../loaders";
import { BuyerSite } from "../models";

export class BuyerOperation {
    private get source() {
        return appDataSource;
    }

    get buyerSiteRepo() {
        return this.source.getRepository(BuyerSite);
    }

    public async insertBuyerSite(params: Partial<BuyerSite>) {
        const newBuyer = this.buyerSiteRepo.create(params);

        return this.buyerSiteRepo.save(newBuyer);
    }

    public async updateBuyerSite(params: Partial<BuyerSite>) {
        return this.buyerSiteRepo.save(params);
    }

    public createBuyerSite(params: Partial<BuyerSite>) {
        return this.buyerSiteRepo.create(params);
    }
}

const buyerOperation = new BuyerOperation();
export default buyerOperation;
