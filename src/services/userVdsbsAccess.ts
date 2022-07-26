/* eslint-disable no-else-return */
// import wrapper from "../scripts/wrapper";
// import { vendorToDealerSiteToBuyerSiteOperation } from ".";
// import {
//     BuyerSite,
//     User,
//     UserEntityRelation,
//     Vendor,
//     VendorToDealerSite,
// } from "../models";
// import BaseService from "./BaseService";

import { vendorToDealerSiteToBuyerSiteOperation } from ".";
import { VendorToDealerSite, VendorToDealerSiteToBuyerSite } from "../models";
import BaseService from "./BaseService";
import userEntityRelationOperation from "./userEntityRelationOperation";

class UserToVdsbs extends BaseService {
    private userId: number;

    public set setUserId(userId: number) {
        this.userId = userId;
    }

    private async findUserEntity() {
        const userEntity = await userEntityRelationOperation.repo.findOne({
            where: { userId: this.userId },
            relations: {
                buyerSiteTableRef: true,
                dealerSiteTableRef: true,
                vendorTableRef: true,
            },
        });
        if (!userEntity) return false;
        return {
            relatedVendorId: userEntity?.vendorTableRef?.id,
            relatedDealerSiteId: userEntity?.dealerSiteTableRef?.id,
            relatedBuyerSiteId: userEntity?.buyerSiteTableRef?.id,
            userId: userEntity.userId,
        };
    }

    public async tableRouter() {
        const res = await this.findUserEntity();
        if (!res) return false;

        if (res.relatedBuyerSiteId) {
            return this.ifItsBuyerSite(res.relatedBuyerSiteId);
        } else if (res.relatedDealerSiteId) {
            return this.ifItsDealerSite(res.relatedDealerSiteId);
        } else if (res.relatedVendorId) {
            return this.ifItsVendor(res.relatedVendorId);
        }
        return false;
    }

    private async sequence(
        id: number,
        specificIdName: string,
        getAll = false,
        active = false
    ) {
        const vdsQb = this.source
            .getRepository(VendorToDealerSite)
            .createQueryBuilder(`vds`);

        const vdsbsQb = this.source
            .getRepository(VendorToDealerSiteToBuyerSite)
            .createQueryBuilder("vdsbs");

        const vds = await vdsQb
            .where(`vds.${specificIdName}= ${id}`)
            .select("id")
            .execute();

        if (vds.length && vds[0]?.id) {
            const allVdsbs = vdsbsQb.where(`vdsbs.vds_rltn_id = ${vds[0].id}`);
            if (getAll) {
                allVdsbs
                    .leftJoinAndSelect("vdsbs.vToDS", "vds")
                    .leftJoinAndSelect("vdsbs.buyerSite", "buyer_site")
                    .leftJoinAndSelect("vds.vendor", "vendor")
                    .leftJoinAndSelect("vds.dealerSite", "dealer_site")
                    .select([
                        "*",
                        "vds",
                        "buyer_site",
                        "vendor",
                        "dealer_site",
                    ]);
            } else {
                allVdsbs.select("id");
            }

            if (active) {
                const currentDate = new Date(Date.now());
                allVdsbs.andWhere("vdsbs.start_date > :start_date", {
                    start_date: currentDate,
                });
                allVdsbs.andWhere("vdsbs.end_date < :end_date", {
                    end_date: currentDate,
                });
            }
            return allVdsbs.execute();
        }

        return false;
    }

    private ifItsDealerSite(id: number) {
        const specificIdName = "dealer_site_id";
        return this.sequence(id, specificIdName, true);
    }

    private ifItsVendor(id: number) {
        const specificIdName = "vendor_id";
        return this.sequence(id, specificIdName, true);
    }

    private ifItsBuyerSite(id: number) {
        vendorToDealerSiteToBuyerSiteOperation.repo.findOne({
            where: { buyerSite: { id } },
            relations: { buyerSite: true, id: true },
        });
    }
}

export default new UserToVdsbs();
