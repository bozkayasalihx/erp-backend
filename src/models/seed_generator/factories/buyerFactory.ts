import { faker } from "@faker-js/faker";
import { define } from "typeorm-seeding";
import Buyer from "../../Buyer";

define(Buyer, (fack: typeof faker) => {
    const buyer = new Buyer();
    buyer.name = fack.company.companyName();
    buyer.tax_no = fack.random.word();
    buyer.start_date = fack.date.recent();
    buyer.end_date = fack.date.future();
    return buyer;
});
