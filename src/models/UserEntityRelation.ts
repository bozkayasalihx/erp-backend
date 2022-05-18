import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import BuyerSite from "./BuyerSite";
import DealerSite from "./DealerSite";
import SuperEntity from "./SuperEntity";
import User from "./User";
import Vendor from "./Vendor";

@Entity("user_entity_relations")
export default class UserEntityRelation extends SuperEntity {
    @Column({
        type: "varchar",
        length: 240,
        name: "description",
        nullable: true,
    })
    public description: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    public user: User;

    @ManyToOne(() => Vendor)
    @JoinColumn({ name: "vendor_table_ref_id" })
    public vendor_table_ref: Vendor;

    @ManyToOne(() => BuyerSite)
    @JoinColumn({ name: "buyer_site_ref_id" })
    public buyer_site_table_ref: BuyerSite;

    @ManyToOne(() => DealerSite)
    @JoinColumn({ name: "dealer_site_ref_id" })
    public dealer_site_table_ref: DealerSite;
}

// vendor => vendor.id
// dealer_site => dealer_site.id
// buyer_site => buyer_site.id

// katmanli mimari olmasi lazjim
// type = vendor => vendor.id
//        dealer_site => dealer_site.id
//        buyer_site  => buyer_site.id
