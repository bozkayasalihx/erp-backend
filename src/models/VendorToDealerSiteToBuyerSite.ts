import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    RelationId,
} from "typeorm";
import Advance from "./Advance";
import BuyerSite from "./BuyerSite";
import DealerRouteUser from "./DealerRouteUser";
import Deposit from "./Deposit";
import Invoices from "./Invoice";
import Payments from "./Payment";
import PaymentMatches from "./PaymentMatches";
import SuperEntity from "./SuperEntity";
import VendorToDealerSite from "./VendorToDealerSite";
@Entity("vdsbs_relations")
@Index(["buyer_site_id", "vds_rltn_id"], { unique: true })
export default class VendorToDealerSiteToBuyerSite extends SuperEntity {
    /**Properties */
    @Column({
        type: "varchar",
        length: 240,
        default: null,
        name: "description",
        nullable: true,
    })
    public description: string;

    /** relations */
    @ManyToOne(() => BuyerSite, (buyerSite) => buyerSite.vToDS)
    @JoinColumn({ name: "buyer_site_id" })
    public buyerSites: Array<BuyerSite>;

    @ManyToOne(() => VendorToDealerSite, (vToDS) => vToDS.vToDsBs)
    @JoinColumn({ name: "vds_rltn_id" })
    public vToDS: Array<VendorToDealerSite>;

    @RelationId((vdsbs: VendorToDealerSiteToBuyerSite) => vdsbs.buyerSites)
    @Column({ name: "vds_rltn_id" })
    public buyer_site_id: number;

    @RelationId((vdsbs: VendorToDealerSiteToBuyerSite) => vdsbs.vToDS)
    @Column({ name: "buyer_site_id" })
    public vds_rltn_id: number;

    @OneToMany(() => Invoices, (invoices) => invoices.vdsbs)
    public invoices: Array<Invoices>;

    @OneToMany(() => Payments, (payments) => payments.vdsbs)
    public payments: Array<Payments>;

    @OneToMany(() => PaymentMatches, (pm) => pm.vdsbs)
    public payment_matches: Array<PaymentMatches>;

    @OneToMany(() => Deposit, (deposit) => deposit.vdsbs)
    public deposits: Array<Deposit>;

    @OneToMany(() => Advance, (advance) => advance.vdsbs)
    public advances: Array<Advance>;

    @OneToMany(
        () => DealerRouteUser,
        (dealerUserRoute) => dealerUserRoute.vdsbs
    )
    public dealer_route_users: Array<DealerRouteUser>;
}
