import { Column, Entity, Index, ManyToOne, RelationId } from "typeorm";
import BaseEntity from "./BaseEntity";
import BuyerSite from "./BuyerSite";
import VendorToDealerSite from "./VendorToDealerSite";

@Entity("vdsbs_relations")
@Index(["vToDs_id", "buyer_site_id"], { unique: true })
export default class VendorToDealerSiteToBuyerSite extends BaseEntity {
    /**Properties */
    @Column({ type: "varchar", length: 240, default: null })
    description: string;

    @ManyToOne(() => BuyerSite, buyerSite => buyerSite.vToDS)
    buyerSites: Array<BuyerSite>;

    @ManyToOne(() => VendorToDealerSite, vToDS => vToDS.vToDsBs)
    vToDS: Array<VendorToDealerSite>;

    @RelationId((vToDsBs: VendorToDealerSiteToBuyerSite) => vToDsBs.buyerSites)
    @Column({ name: "vds_rltn_id" })
    vToDs_id: number;

    @RelationId((vToDsBs: VendorToDealerSiteToBuyerSite) => vToDsBs.vToDS)
    @Column({ name: "buyer_site_id" })
    buyer_site_id: number;
}
