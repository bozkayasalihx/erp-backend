import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import BaseEntity from "./BaseEntity";
import BuyerSite from "./BuyerSite";
import User from "./User";

@Entity("buyer")
export default class Buyer extends BaseEntity {
    /** Properties */
    @Column({ type: "varchar", length: 240 })
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

    /** Relations */
    @OneToMany(() => BuyerSite, buyerSite => buyerSite.buyer)
    buyer_sites: Array<BuyerSite>;
}
