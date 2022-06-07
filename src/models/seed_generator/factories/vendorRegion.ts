import { faker } from "@faker-js/faker";
import { define } from "typeorm-seeding";
import VendorRegion from "../../VendorRegion";

define(VendorRegion, (fack: typeof faker) => {
    const vendorRegion = new VendorRegion();
    vendorRegion.name = fack.company.companyName();
    vendorRegion.start_date = fack.date.recent();
    vendorRegion.end_date = fack.date.future();
    return vendorRegion;
});
