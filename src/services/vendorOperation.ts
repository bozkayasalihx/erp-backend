import { appDataSource } from "../loaders";
import { Vendor, VendorRegion } from "../models";

class VendorOperation {
    public get vendorRepo() {
        return appDataSource.getRepository(Vendor);
    }

    public get vendorRegionRepo() {
        return appDataSource.getRepository(VendorRegion);
    }

    public createVendorRegion(params: Partial<VendorRegion>) {
        return VendorRegion.create({
            ...params,
        });
    }

    public createVendor(params: Partial<Vendor>) {
        return Vendor.create({
            ...params,
        });
    }
}

export default new VendorOperation();
