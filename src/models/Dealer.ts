import { Column, Entity, OneToMany } from "typeorm";
import DealerSite from "./DealerSite";
import SuperEntity from "./SuperEntity";

@Entity("dealer")
export default class Dealer extends SuperEntity {
    /** Properites*/
    @Column({ name: "name" })
    public name: string;

    @Column({ type: "varchar", length: 20, name: "tax_no" })
    public tax_no: string;

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
    @OneToMany(() => DealerSite, (dealerSite) => dealerSite.dealer)
    public dealer_sites: Array<DealerSite>;
}
