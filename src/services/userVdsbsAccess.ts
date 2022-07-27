/* eslint-disable no-else-return */
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

    public async tableRouter(getAll = false, active = false) {
        const res = await this.findUserEntity();
        if (!res) return false;

        if (res.relatedBuyerSiteId) {
            return this.ifItsBuyerSite(res.relatedBuyerSiteId);
        } else if (res.relatedDealerSiteId) {
            return this.ifItsDealerSite(
                res.relatedDealerSiteId,
                getAll,
                active
            );
        } else if (res.relatedVendorId) {
            return this.ifItsVendor(res.relatedVendorId, getAll, active);
        }
        return false;
    }

    private async sequence(
        id: number,
        specificIdName: string,
        getAll: boolean,
        active: boolean
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

                if (active) {
                    const actives = await this.activeRecords();
                    allVdsbs.andWhere(actives);
                }

                return allVdsbs.execute();
            } else {
                allVdsbs.select("id");
            }

            return allVdsbs.execute();
        }

        return false;
    }

    private async activeRecords() {
        const tables = ["vds", "buyer_site", "vendor", "dealer_site"];
        let condition = "";
        let i = 0;
        while (i < tables.length) {
            if (i === tables.length - 1)
                condition += `${tables[i]}.start_date < NOW() AND ${tables[i]}.end_date > NOW()`;
            else
                condition += `${tables[i]}.start_date < NOW() AND ${tables[i]}.end_date > NOW() AND `;
            i++;
        }
        return condition;
    }

    private tsDateToPostgres(date: Date) {
        function zeroPad(d: number) {
            // eslint-disable-next-line prefer-template
            return ("0" + d).slice(-2);
        }

        const parsed = new Date(date);
        return [
            parsed.getUTCFullYear(),
            zeroPad(parsed.getMonth() + 1),
            zeroPad(parsed.getDate()),
            zeroPad(parsed.getHours()),
            zeroPad(parsed.getMinutes()),
            zeroPad(parsed.getSeconds()),
        ].join(" ");
    }

    private ifItsDealerSite(id: number, getAll: boolean, active: boolean) {
        const specificIdName = "dealer_site_id";
        return this.sequence(id, specificIdName, getAll, active);
    }

    private ifItsVendor(id: number, getAll: boolean, active: boolean) {
        const specificIdName = "vendor_id";
        return this.sequence(id, specificIdName, getAll, active);
    }

    private ifItsBuyerSite(id: number) {
        vendorToDealerSiteToBuyerSiteOperation.repo.findOne({
            where: { buyerSite: { id } },
            relations: {
                buyerSite: true,
                id: true,
                vToDS: { dealerSite: true, vendor: true },
            },
        });
    }
}

export default new UserToVdsbs();
