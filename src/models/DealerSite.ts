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
    @Column()
    name: string;

    @Column({ default: null })
    attribute: string;

    @Column({ default: null })
    attribute2: string;

    @Column({ default: null })
    attribute3: string;

    @Column({ default: null })
    attribute4: string;

    @Column({ default: null })
    attribute5: string;

    /** Releations */
    @ManyToOne(() => Dealer, dealer => dealer.dealer_sites)
    dealer: Dealer;

    @RelationId((dealerSite: DealerSite) => dealerSite.dealer, "dealer_id")
    @Column({ name: "dealer_id" })
    dealer_id: number;

    /** Referantions */

    @OneToMany(
        () => VendorToDealerSite,
        vendorToDealerSite => vendorToDealerSite.dealerSite
    )
    vendorToDealerSites: Array<VendorToDealerSite>;
}
