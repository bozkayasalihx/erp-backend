import { Column, Entity, OneToMany } from "typeorm";
import SuperEntity from "./SuperEntity";
import Vendor from "./Vendor";

@Entity("vendor_regions")
export default class VendorRegion extends SuperEntity {
    //** Properties */

    @Column({ type: "varchar", length: 240, name: "name" })
    public name: string;

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

    /** relations */
    @OneToMany(() => Vendor, (vendor) => vendor.vendor_region)
    public vendors: Array<Vendor>;
}
