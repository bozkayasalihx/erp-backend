import { faker } from "@faker-js/faker";
import { define } from "typeorm-seeding";
import DealerSite from "../../DealerSite";

define(DealerSite, (fack: typeof faker) => {
    const dealerSite = new DealerSite();
    dealerSite.name = fack.company.companyName();
    dealerSite.start_date = fack.date.recent();
    dealerSite.end_date = fack.date.future();
    return dealerSite;
});
