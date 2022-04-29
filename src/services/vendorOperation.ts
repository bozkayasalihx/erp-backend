import { appDataSource } from "../loaders";
import { Vendor, VendorRegion } from "../models";

export class VendorOperation {
    private get source() {
        return appDataSource;
    }
    public get vendorRepo() {
        return this.source.getRepository(Vendor);
    }

    public get vendorRegionRepo() {
        return this.source.getRepository(VendorRegion);
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
