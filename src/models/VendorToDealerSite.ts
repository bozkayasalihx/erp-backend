import { number } from "joi";
import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    OneToOne,
    RelationId,
} from "typeorm";
import BaseEntity from "./BaseEntity";
import DealerSite from "./DealerSite";
import User from "./User";
import Vendor from "./Vendor";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("vds_relations")
@Index(["vendor_id", "dealer_site_id"], { unique: true })
export default class VendorToDealerSite extends BaseEntity {
    @Column({ type: "varchar", length: 240, default: null })
    description: string;

    /** Relations */

    @ManyToOne(() => Vendor, vendor => vendor.vendorToDealerSite)
    vendor: Vendor;

    @ManyToOne(() => DealerSite, dealerSite => dealerSite.vendorToDealerSite)
    dealerSite: DealerSite;

    @OneToMany(() => VendorToDealerSiteToBuyerSite, vdsbs => vdsbs)
    vdsbs: VendorToDealerSiteToBuyerSite;

    /** referations */
    // @RelationId((vendor: Vendor) => vendor.)
    // @Column()
    // vendor_id: number;

    // @RelationId((dealerSite: DealerSite) => dealerSite)
    // @Column()
    // dealer_site_id: number;
}
