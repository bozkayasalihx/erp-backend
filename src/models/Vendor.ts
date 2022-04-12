import { Column, Entity, OneToMany, RelationId } from "typeorm";
import BaseEntity from "./BaseEntity";
import VendorToDealerSite from "./VendorToDealerSite";

@Entity("vendor")
export default class Vendor extends BaseEntity {
    //** Properties */
    @Column({ type: "varchar", length: 240 })
    name: string;

    @Column({ type: "varchar", length: 20 })
    tax_no: string;

    @Column({ nullable: true })
    attribute: string;

    @Column({ nullable: true })
    attribute2: string;

    @Column({ nullable: true })
    attribute3: string;

    @Column({ nullable: true })
    attribute4: string;

    @Column({ nullable: true })
    attribute5: string;

    /* Releations */

    @OneToMany(
        () => VendorToDealerSite,
        vendorToDealerSite => vendorToDealerSite.vendor
    )
    vendorToDealerSite: Array<VendorToDealerSite>;
}

const vendor = new Vendor();
