import { Column, Entity, OneToMany } from "typeorm";
import BuyerSite from "./BuyerSite";
import SuperEntity from "./SuperEntity";

@Entity("buyer")
export default class Buyer extends SuperEntity {
    /** Properties */
    @Column({ type: "varchar", length: 240, name: "name" })
    public name: string;

    @Column({ type: "varchar", length: 20, name: "tax_no" })
    public tax_no: string;

    @Column({ default: null, name: "attribute" })
    public attribute: string;

    @Column({ default: null, name: "attribute2" })
    public attribute2: string;

    @Column({ default: null, name: "attribute3" })
    public attribute3: string;

    @Column({ default: null, name: "attribute4" })
    public attribute4: string;

    /** Relations */
    @OneToMany(() => BuyerSite, (buyerSite) => buyerSite.buyer)
    public buyer_sites: Array<BuyerSite>;
}
