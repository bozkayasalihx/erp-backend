import { faker } from "@faker-js/faker";
import { define } from "typeorm-seeding";
import VendorToDealerSite from "../../VendorToDealerSite";

define(VendorToDealerSite, (fack: typeof faker) => {
    const vds = new VendorToDealerSite();
    vds.start_date = fack.date.recent();
    vds.end_date = fack.date.future();
    vds.description = fack.lorem.words(2);
    return vds;
});
