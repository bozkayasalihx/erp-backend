import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import Buyer from "./Buyer";
import SuperEntity from "./SuperEntity";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("buyer_site")
export default class BuyerSite extends SuperEntity {
    /** Properties */
    @Column({ name: "name" })
    public name: string;

    @Column({ default: null, name: "attribute" })
    public attribute: string;

    @Column({ default: null, name: "attribute2" })
    public attribute2: string;

    @Column({ default: null, name: "attribute3" })
    public attribute3: string;

    @Column({ default: null, name: "attribute4" })
    public attribute4: string;

    /** Relations */
    @ManyToOne(() => Buyer, (buyer) => buyer.buyer_sites)
    @Index("buyer_id", { unique: true })
    @JoinColumn({ name: "buyer_id" })
    public buyer: Buyer;

    @OneToMany(() => VendorToDealerSiteToBuyerSite, (vToDS) => vToDS.buyerSites)
    public vToDS: VendorToDealerSiteToBuyerSite;
}
