import { faker } from "@faker-js/faker";
import { define } from "typeorm-seeding";
import DealerRouteUser from "../../DealerRouteUser";

define(DealerRouteUser, (fack: typeof faker) => {
    const vendorRegion = new DealerRouteUser();
    vendorRegion.description = fack.company.companyName();
    vendorRegion.start_date = fack.date.recent();
    vendorRegion.end_date = fack.date.future();
    return vendorRegion;
});
