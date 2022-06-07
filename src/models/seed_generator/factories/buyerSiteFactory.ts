import { faker } from "@faker-js/faker";
import { define } from "typeorm-seeding";
import BuyerSite from "../../BuyerSite";

define(BuyerSite, (fack: typeof faker) => {
    const buyerSite = new BuyerSite();
    buyerSite.name = fack.company.companyName();
    buyerSite.start_date = fack.date.recent();
    buyerSite.end_date = fack.date.future();
    return buyerSite;
});
