import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    RelationId,
} from "typeorm";
import Dealer from "./Dealer";
import SuperEntity from "./SuperEntity";
import VendorToDealerSite from "./VendorToDealerSite";

@Entity("dealer_sites")
@Index(["dealer_id"])
export default class DealerSite extends SuperEntity {
    /** Properites*/
    @Column({ name: "name" })
    public name: string;

    @Column({ default: null, name: "attribute1" })
    public attribute1: string;

    @Column({ default: null, name: "attribute2" })
    public attribute2: string;

    @Column({ default: null, name: "attribute3" })
    public attribute3: string;

    @Column({ default: null, name: "attribute4" })
    public attribute4: string;

    @Column({ default: null, name: "attribute5" })
    public attribute5: string;

    /** Releations */
    @ManyToOne(() => Dealer, (dealer) => dealer.dealer_sites)
    public dealer: Dealer;

    @RelationId((dealerSite: DealerSite) => dealerSite.dealer)
    @Column({ name: "dealer_id" })
    public dealer_id: number;

    /** Referantions */
    @OneToMany(
        () => VendorToDealerSite,
        (vendorToDealerSite) => vendorToDealerSite.dealerSite
    )
    public vendorToDealerSites: Array<VendorToDealerSite>;
}
