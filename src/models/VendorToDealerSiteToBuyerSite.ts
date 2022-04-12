import { Column, Entity, ManyToOne, OneToOne, RelationId } from "typeorm";
import BaseEntity from "./BaseEntity";
import BuyerSite from "./BuyerSite";
import User from "./User";
import VendorToDealerSite from "./VendorToDealerSite";

@Entity("vdsbs_relations")
export default class VendorToDealerSiteToBuyerSite extends BaseEntity {
    /**Properties */

    @Column({ type: "varchar", length: 240, default: null })
    description: string;

    /** Relations */
    @ManyToOne(
        () => VendorToDealerSite,
        vendorToDealerSite => vendorToDealerSite.vdsbs
    )
    buyer_site: BuyerSite;

    @ManyToOne(() => BuyerSite, buyerSite => buyerSite.vdsbs)
    vendorToDealerSite: Array<VendorToDealerSite>;

    /** References  */

    @RelationId((vToDs: VendorToDealerSiteToBuyerSite) => vToDs.buyer_site)
    @Column()
    buyer_site_id: number;

    @RelationId(
        (vToDs: VendorToDealerSiteToBuyerSite) => vToDs.vendorToDealerSite
    )
    @Column()
    vToDs_id: number;
}
