import { faker } from "@faker-js/faker";
import { define } from "typeorm-seeding";
import VendorToDealerSiteToBuyerSite from "../../VendorToDealerSiteToBuyerSite";

define(VendorToDealerSiteToBuyerSite, (fack: typeof faker) => {
    const vdsbs = new VendorToDealerSiteToBuyerSite();
    vdsbs.start_date = fack.date.recent();
    vdsbs.end_date = fack.date.future();
    vdsbs.description = fack.lorem.words(2);
    return vdsbs;
});
