import { faker } from "@faker-js/faker";
import { define } from "typeorm-seeding";
import Dealer from "../../Dealer";

define(Dealer, (fack: typeof faker) => {
    const dealer = new Dealer();
    dealer.name = fack.company.companyName();
    dealer.tax_no = fack.random.word();
    dealer.start_date = fack.date.recent();
    dealer.end_date = fack.date.future();
    return dealer;
});
