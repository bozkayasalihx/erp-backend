import { DataSource } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import {
    Buyer,
    BuyerSite,
    Dealer,
    DealerSite,
    User,
    UserEntityRelation,
    Vendor,
    VendorRegion,
    VendorToDealerSite,
    VendorToDealerSiteToBuyerSite,
} from "../../../models";

const random = () => {
    return Math.floor(Math.random() * 3);
};

const randomLength = (size: number) => {
    return Math.floor(Math.random() * size);
};

export default class InitialDatabaseSeed implements Seeder {
    public async run(factory: Factory, dataSource: DataSource): Promise<void> {
        const users = await factory(User)().createMany(20);
        const buyers = await factory(Buyer)().createMany(20);
        const vendors = await factory(Vendor)().createMany(20);
        const dealers = await factory(Dealer)().createMany(20);
        const dealerSites = await factory(DealerSite)()
            .map(async (entity) => {
                entity.dealer = dealers[randomLength(dealers.length)];
                return entity;
            })
            .createMany(20);

        const buyerSites = await factory(BuyerSite)()
            .map(async (entity) => {
                entity.buyer = buyers[randomLength(buyers.length)];
                return entity;
            })
            .createMany(20);

        const vdss = await factory(VendorToDealerSite)()
            .map(async (entity) => {
                entity.vendor = vendors[randomLength(vendors.length)];
                entity.dealerSite =
                    dealerSites[randomLength(dealerSites.length)];
                entity.vToDsBs = vdsbss;
                return entity;
            })
            .createMany(20);

        const vdsbss = await factory(VendorToDealerSiteToBuyerSite)()
            .map(async (entity) => {
                entity.vToDS = vdss[randomLength(vdss.length)];
                entity.buyerSite = buyerSites[randomLength(buyerSites.length)];
                return entity;
            })
            .createMany(20);

        const userentityrelation = await factory(UserEntityRelation)()
            .map(async (entity) => {
                entity.user = users[Math.floor(Math.random() * users.length)];
                const index = random();
                index === 0
                    ? (entity.buyer_site_table_ref =
                          buyerSites[randomLength(buyerSites.length)])
                    : index === 1
                    ? (entity.dealer_site_table_ref =
                          dealerSites[randomLength(dealerSites.length)])
                    : (entity.vendor_table_ref =
                          vendors[randomLength(vendors.length)]);

                return entity;
            })
            .createMany(20);

        const vendorsRegions = await factory(VendorRegion)()
            .map(async (entity) => {
                entity.vendor = vendors[randomLength(vendors.length)];
                return entity;
            })
            .createMany(20);
    }
}
