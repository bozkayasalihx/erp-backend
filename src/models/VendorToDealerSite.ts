import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    RelationId,
} from "typeorm";
import BaseEntity from "./BaseEntity";
import DealerSite from "./DealerSite";
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

    @ManyToOne(() => DealerSite, dealerSite => dealerSite.vendorToDealerSites)
    dealerSite: DealerSite;

    @RelationId((vToDS: VendorToDealerSite) => vToDS.vendor)
    @Column()
    vendor_id: number;

    @RelationId((vToDS: VendorToDealerSite) => vToDS.dealerSite)
    @Column()
    dealer_site_id: number;

    @OneToMany(() => VendorToDealerSiteToBuyerSite, vToDsBs => vToDsBs.vToDS)
    vToDsBs: VendorToDealerSiteToBuyerSite;
}
