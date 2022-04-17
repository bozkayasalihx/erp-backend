import { Column, Entity, OneToMany } from "typeorm";
import SuperEntity from "./BaseEntity";
import VendorToDealerSite from "./VendorToDealerSite";

@Entity("vendor")
export default class Vendor extends SuperEntity {
    //** Properties */
    @Column({ type: "varchar", length: 240, name: "name" })
    name: string;

    @Column({ type: "varchar", length: 20, name: "tax_no" })
    tax_no: string;

    @Column({ nullable: true, name: "attribute" })
    attribute: string;

    @Column({ nullable: true, name: "attribute2" })
    attribute2: string;

    @Column({ nullable: true, name: "attribute3" })
    attribute3: string;

    @Column({ nullable: true, name: "attribute4" })
    attribute4: string;

    @Column({ nullable: true, name: "attribute5" })
    attribute5: string;

    /* Releations */
    @OneToMany(
        () => VendorToDealerSite,
        (vendorToDealerSite) => vendorToDealerSite.vendor
    )
    vendorToDealerSite: Array<VendorToDealerSite>;
}
