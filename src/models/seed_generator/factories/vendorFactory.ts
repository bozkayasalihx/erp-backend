import { faker } from "@faker-js/faker";
import { define } from "typeorm-seeding";
import Vendor from "../../Vendor";

define(Vendor, (fack: typeof faker) => {
    const vendor = new Vendor();
    vendor.name = fack.company.companyName();
    vendor.tax_no = fack.random.word();
    vendor.start_date = fack.date.recent();
    vendor.end_date = fack.date.future();
    return vendor;
});
