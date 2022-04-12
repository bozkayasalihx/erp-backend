import {
    AfterInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    RelationId,
} from "typeorm";
import BaseEntity from "./BaseEntity";
import DealerSite from "./DealerSite";
import User from "./User";

@Entity("dealer")
export default class Dealer extends BaseEntity {
    /** Properites*/
    @Column()
    name: string;

    @Column({ type: "varchar", length: 20 })
    tax_no: string;

    @Column({ default: null })
    attribute: string;

    @Column({ default: null })
    attribute2: string;

    @Column({ default: null })
    attribute3: string;

    @Column({ default: null })
    attribute4: string;

    /** Releations */
    @OneToMany(() => DealerSite, dealerSite => dealerSite.dealer)
    dealer_sites: Array<DealerSite>;
}
