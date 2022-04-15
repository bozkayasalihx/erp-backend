import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    RelationId,
} from "typeorm";
import BaseEntity from "./BaseEntity";
import Dealer from "./Dealer";
import Vendor from "./Vendor";
import VendorToDealerSite from "./VendorToDealerSite";

@Entity("dealer_site")
@Index(["dealer_id"], { unique: true })
export default class DealerSite extends BaseEntity {
    /** Properites*/
    @Column({ name: "name" })
    name: string;

    @Column({ default: null, name: "attribute" })
    attribute: string;

    @Column({ default: null, name: "attribute2" })
    attribute2: string;

    @Column({ default: null, name: "attribute3" })
    attribute3: string;

    @Column({ default: null, name: "attribute4" })
    attribute4: string;

    @Column({ default: null, name: "attribute5" })
    attribute5: string;

    /** Releations */
    @ManyToOne(() => Dealer, dealer => dealer.dealer_sites)
    dealer: Dealer;

    @RelationId((dealerSite: DealerSite) => dealerSite.dealer)
    @Column({ name: "dealer_id" })
    dealer_id: number;

    /** Referantions */

    @OneToMany(
        () => VendorToDealerSite,
        vendorToDealerSite => vendorToDealerSite.dealerSite
    )
    vendorToDealerSites: Array<VendorToDealerSite>;
}
