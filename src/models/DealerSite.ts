import {
    Column,
    Entity,
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

    /** Referantions */
    @RelationId((dealerSite: DealerSite) => dealerSite.dealer)
    @Column()
    dealer_id: number;

    @RelationId((dealerSite: DealerSite) => dealerSite.created_user)
    user_id: number;

    @OneToMany(
        () => VendorToDealerSite,
        vendorToDealerSite => vendorToDealerSite.dealerSite
    )
    vendorToDealerSite: Array<VendorToDealerSite>;
}
