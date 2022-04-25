import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import SuperEntity from "./SuperEntity";
import VendorRegion from "./VendorRegion";
import VendorToDealerSite from "./VendorToDealerSite";

@Entity("vendor")
export default class Vendor extends SuperEntity {
    //** Properties */
    @Column({ type: "varchar", length: 240, name: "name" })
    public name: string;

    @Column({ type: "varchar", length: 20, name: "tax_no" })
    public tax_no: string;

    @Column({ nullable: true, name: "attribute1" })
    public attribute1: string;

    @Column({ nullable: true, name: "attribute2" })
    public attribute2: string;

    @Column({ nullable: true, name: "attribute3" })
    public attribute3: string;

    @Column({ nullable: true, name: "attribute4" })
    public attribute4: string;

    @Column({ nullable: true, name: "attribute5" })
    public attribute5: string;

    /* Releations */
    @OneToMany(
        () => VendorToDealerSite,
        (vendorToDealerSite) => vendorToDealerSite.vendor
    )
    public vendorToDealerSite: Array<VendorToDealerSite>;

    @ManyToOne(() => VendorRegion, (vendorRegion) => vendorRegion.vendors)
    @JoinColumn({ name: "vendor_region_id" })
    public vendor_region: VendorRegion;
}
