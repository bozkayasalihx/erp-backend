import { Column, Entity, Index, ManyToOne, RelationId } from "typeorm";
import BaseEntity from "./BaseEntity";
import BuyerSite from "./BuyerSite";
import VendorToDealerSite from "./VendorToDealerSite";

@Entity("vdsbs_relations")
@Index(["vds_rltn_id", "buyer_site_id"], { unique: true })
export default class VendorToDealerSiteToBuyerSite extends BaseEntity {
    /**Properties */
    @Column({
        type: "varchar",
        length: 240,
        default: null,
        name: "description",
    })
    description: string;

    @ManyToOne(() => BuyerSite, buyerSite => buyerSite.vToDS)
    buyerSites: Array<BuyerSite>;

    @ManyToOne(() => VendorToDealerSite, vToDS => vToDS.vToDsBs)
    vToDS: Array<VendorToDealerSite>;

    /** referanss */
    @RelationId((vToDsBs: VendorToDealerSiteToBuyerSite) => vToDsBs.buyerSites)
    @Column({ name: "buyer_site_id" })
    buyer_site_id: number;

    @RelationId((vToDsBs: VendorToDealerSiteToBuyerSite) => vToDsBs.vToDS)
    @Column({ name: "vds_rltn_id" })
    vds_rltn_id: number;
}
