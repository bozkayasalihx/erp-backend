import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    MissingDeleteDateColumnError,
    OneToOne,
    RelationId,
    ViewColumn,
} from "typeorm";
import BaseEntity from "./BaseEntity";
import User from "./User";
import MiddleViewLayer from "./ViewEntity";
// import MiddleSolution from "./ViewEntity";

@Entity("user_entity_relation")
export default class UserEntityRelation extends BaseEntity {
    @Column({ type: "varchar", length: 240 })
    description: string;

    @ManyToOne(() => User, user => user.userEntityRelation)
    @JoinColumn({ name: "user_id" })
    users: Array<User>;

    @ManyToOne(() => MiddleViewLayer)
    @Column()
    ref_entity_id: number;
}

// vendor => vendor.id
// dealer_site => dealer_site.id
// buyer_site => buyer_site.id

// katmanli mimari olmasi lazjim
// type = vendor => vendor.id
//        dealer_site => dealer_site.id
//        buyer_site  => buyer_site.id
