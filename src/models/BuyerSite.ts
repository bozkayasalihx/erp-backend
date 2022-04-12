import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    RelationId,
} from "typeorm";
import BaseEntity from "./BaseEntity";
import Buyer from "./Buyer";
import User from "./User";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("buyer_site")
export default class BuyerSite extends BaseEntity {
    /** Properties */
    @Column()
    name: string;

    @Column({ default: null })
    attribute: string;

    @Column({ default: null })
    attribute2: string;

    @Column({ default: null })
    attribute3: string;

    @Column({ default: null })
    attribute4: string;

    /** Relations */
    @ManyToOne(() => Buyer, buyer => buyer.id)
    buyers: Array<Buyer>;

    @OneToMany(() => VendorToDealerSiteToBuyerSite, vDsBs => vDsBs)
    vdsbs: VendorToDealerSiteToBuyerSite;

    /** referans */
    @RelationId((buyerSite: BuyerSite) => buyerSite.buyers)
    @Column()
    buyer_id: number;
}
