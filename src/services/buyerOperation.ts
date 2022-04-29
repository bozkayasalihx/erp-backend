import { appDataSource } from "../loaders";
import { Buyer } from "../models";

export class BuyerOperation {
    private get source() {
        return appDataSource;
    }

    public get buyerRepo() {
        return this.source.getRepository(Buyer);
    }

    public async insertBuyer(params: Partial<Buyer>) {
        const newBuyer = this.buyerRepo.create(params);

        return this.buyerRepo.save(newBuyer);
    }

    public async updateBuyer(params: Partial<Buyer>) {
        return this.buyerRepo.save(params);
    }

    public createBuyer(params: Partial<Buyer>) {
        return this.buyerRepo.create(params);
    }
}

const buyerOperation = new BuyerOperation();
export default buyerOperation;
