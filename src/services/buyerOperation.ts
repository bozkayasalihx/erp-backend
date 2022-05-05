import { appDataSource } from "../loaders";
import { Buyer } from "../models";

export class BuyerOperation {
    private get source() {
        return appDataSource;
    }

    public get repo() {
        return this.source.getRepository(Buyer);
    }

    public async insertBuyer(params: Partial<Buyer>) {
        const newBuyer = this.repo.create(params);

        return this.repo.save(newBuyer);
    }

    public async updateBuyer(params: Partial<Buyer>) {
        return this.repo.save(params);
    }

    public createBuyer(params: Partial<Buyer>) {
        return this.repo.create(params);
    }
}

const buyerOperation = new BuyerOperation();
export default buyerOperation;
