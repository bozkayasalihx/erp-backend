import VendorToDealerSiteToBuyerSite from "../models/VendorToDealerSiteToBuyerSite";
import BaseService from "../services/BaseService";

class VendorTDealerSiteTBuyerSite extends BaseService {
    public async createVdsbs(params: Partial<VendorToDealerSiteToBuyerSite>) {
        const vdsbs = VendorToDealerSiteToBuyerSite.create({ ...params });
        await vdsbs.save();
    }

    public get repo() {
        return this.source.getRepository(VendorToDealerSiteToBuyerSite);
    }
}

export default new VendorTDealerSiteTBuyerSite();
