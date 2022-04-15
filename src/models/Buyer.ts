import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import BaseEntity from "./BaseEntity";
import BuyerSite from "./BuyerSite";
import User from "./User";

@Entity("buyer")
export default class Buyer extends BaseEntity {
    /** Properties */
    @Column({ type: "varchar", length: 240, name: "name" })
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

    /** Relations */
    @OneToMany(() => BuyerSite, buyerSite => buyerSite.buyer)
    buyer_sites: Array<BuyerSite>;
}
