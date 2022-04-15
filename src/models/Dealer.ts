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
    @Column({ name: "name" })
    name: string;

    @Column({ type: "varchar", length: 20, name: "tax_no" })
    tax_no: string;

    @Column({ default: null, name: "attribute" })
    attribute: string;

    @Column({ default: null, name: "attribute2" })
    attribute2: string;

    @Column({ default: null, name: "attribute3" })
    attribute3: string;

    @Column({ default: null, name: "attribute4" })
    attribute4: string;

    /** Releations */
    @OneToMany(() => DealerSite, dealerSite => dealerSite.dealer)
    dealer_sites: Array<DealerSite>;
}
