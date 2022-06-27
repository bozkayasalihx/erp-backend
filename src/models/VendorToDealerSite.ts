import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    RelationId,
} from "typeorm";
import DealerSite from "./DealerSite";
import { Vendor, VendorToDealerSiteToBuyerSite } from "./index";
import SuperEntity from "./SuperEntity";

@Entity("vds_relations")
@Index(["vendorId", "dealerSiteId"], { unique: true })
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
    public vendorId: number;

    @RelationId((vToDS: VendorToDealerSite) => vToDS.dealerSite)
    @Column({ name: "dealer_site_id" })
    public dealerSiteId: number;
}
