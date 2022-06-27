import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    RelationId,
} from "typeorm";
import { Dealer, VendorToDealerSite } from "./index";
import SuperEntity from "./SuperEntity";

@Entity("dealer_sites")
@Index(["dealerId"])
export default class DealerSite extends SuperEntity {
    /** Properites */
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
    @ManyToOne(() => Dealer, (dealer) => dealer.dealerSites)
    public dealer: Dealer;

    @RelationId((dealerSite: DealerSite) => dealerSite.dealer)
    @Column({ name: "dealer_id" })
    public dealerId: number;

    /** Referantions */
    @OneToMany(
        () => VendorToDealerSite,
        (vendorToDealerSite) => vendorToDealerSite.dealerSite
    )
    public vendorToDealerSites: Array<VendorToDealerSite>;
}
