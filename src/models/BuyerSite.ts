import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Buyer, VendorToDealerSiteToBuyerSite } from "./index";
import SuperEntity from "./SuperEntity";

@Entity("buyer_sites")
export default class BuyerSite extends SuperEntity {
    /** Properties */
    @Column({ name: "name", unique: true })
    public name: string;

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

    /** Relations */
    @ManyToOne(() => Buyer, (buyer) => buyer.buyerSites)
    @Index("buyer_id")
    @JoinColumn({ name: "buyer_id" })
    public buyer: Buyer;

    @OneToMany(() => VendorToDealerSiteToBuyerSite, (vToDS) => vToDS.buyerSite)
    public vToDSBS: VendorToDealerSiteToBuyerSite;
}
