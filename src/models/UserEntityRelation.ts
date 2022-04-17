import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import SuperEntity from "./BaseEntity";
import User from "./User";
import Vendor from "./Vendor";

@Entity("user_entity_relation")
export default class UserEntityRelation extends SuperEntity {
    @Column({ type: "varchar", length: 240, name: "description" })
    description: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    users: User;

    @ManyToOne(() => Vendor)
    @JoinColumn({ name: "ref_table_id" })
    ref_table: Vendor;
}

// vendor => vendor.id
// dealer_site => dealer_site.id
// buyer_site => buyer_site.id

// katmanli mimari olmasi lazjim
// type = vendor => vendor.id
//        dealer_site => dealer_site.id
//        buyer_site  => buyer_site.id
