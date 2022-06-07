import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    RelationId,
} from "typeorm";
import DealerSite from "./DealerSite";
import SuperEntity from "./SuperEntity";
import Vendor from "./Vendor";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("vds_relations")
@Index(["vendor_id", "dealer_site_id"], { unique: true })
export default class VendorToDealerSite extends SuperEntity {
    @Column({
        type: "varchar",
        length: 240,
        default: null,
        name: "description",
        nullable: true,
    })
    public description: string;

    /** Relations */
    @ManyToOne(() => Vendor, (vendor) => vendor.vendorToDealerSite)
    public vendor: Vendor;

    @ManyToOne(() => DealerSite, (dealerSite) => dealerSite.vendorToDealerSites)
    public dealerSite: DealerSite;

    @OneToMany(() => VendorToDealerSiteToBuyerSite, (vToDsBs) => vToDsBs.vToDS)
    public vToDsBs: Array<VendorToDealerSiteToBuyerSite>;

    /** Referans */
    @RelationId((vToDS: VendorToDealerSite) => vToDS.vendor)
    @Column({ name: "vendor_id" })
    public vendor_id: number;

    @RelationId((vToDS: VendorToDealerSite) => vToDS.dealerSite)
    @Column({ name: "dealer_site_id" })
    public dealer_site_id: number;
}
