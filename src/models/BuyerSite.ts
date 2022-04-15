import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import BaseEntity from "./BaseEntity";
import Buyer from "./Buyer";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("buyer_site")
export default class BuyerSite extends BaseEntity {
    /** Properties */
    @Column({ name: "name" })
    name: string;

    @Column({ default: null, name: "attribute" })
    attribute: string;

    @Column({ default: null, name: "attribute2" })
    attribute2: string;

    @Column({ default: null, name: "attribute3" })
    attribute3: string;

    @Column({ default: null, name: "attribute4" })
    attribute4: string;

    /** Relations */
    @ManyToOne(() => Buyer, buyer => buyer.buyer_sites)
    @Index("buyer_id", { unique: true })
    @JoinColumn({ name: "buyer_id" })
    buyer: Buyer;

    @OneToMany(() => VendorToDealerSiteToBuyerSite, vToDS => vToDS.buyerSites)
    vToDS: VendorToDealerSiteToBuyerSite;
}
