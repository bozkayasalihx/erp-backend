import { appDataSource } from "../loaders";
import { Buyer, BuyerSite } from "../models";

class UserOperation {
    private get source() {
        return appDataSource;
    }

    public get buyerRepo() {
        return this.source.getRepository(Buyer);
    }

    get buyerSiteRepo() {
        return this.source.getRepository(BuyerSite);
    }
    public async insertBuyer(params: Partial<Buyer>) {
        const newBuyer = this.buyerRepo.create(params);

        return this.buyerRepo.save(newBuyer);
    }

    public async insertBuyerSite(params: Partial<BuyerSite>) {
        const newBuyer = this.buyerSiteRepo.create(params);

        return this.buyerSiteRepo.save(newBuyer);
    }

    public async updateBuyer(params: Partial<Buyer>) {
        return this.buyerRepo.save(params);
    }

    public async updateBuyerSite(params: Partial<BuyerSite>) {
        return this.buyerSiteRepo.save(params);
    }

    public createBuyer(params: Partial<Buyer>) {
        return this.buyerRepo.create(params);
    }

    public createBuyerSite(params: Partial<BuyerSite>) {
        return this.buyerSiteRepo.create(params);
    }
}

const userOperation = new UserOperation();
export default userOperation;
