import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import {
    Advance,
    BuyerSite,
    DealerRouteUser,
    Deposit,
    Invoice,
    Payment,
    PaymentMatches,
    PaymentSchedule,
    VendorToDealerSite,
} from "./index";
import SuperEntity from "./SuperEntity";

@Entity("vdsbs_relations")
@Index(["buyerSite.id", "vToDS.id"], { unique: true })
export default class VendorToDealerSiteToBuyerSite extends SuperEntity {
    /** Properties */
    @Column({
        type: "varchar",
        length: 240,
        default: null,
        name: "description",
        nullable: true,
    })
    public description: string;

    /** relations */
    @ManyToOne(() => BuyerSite, (buyerSite) => buyerSite.vToDSBS)
    @JoinColumn({ name: "buyer_site_id" })
    public buyerSite: BuyerSite;

    @ManyToOne(() => VendorToDealerSite, (vToDS) => vToDS.vToDsBs)
    @JoinColumn({ name: "vds_rltn_id" })
    public vToDS: VendorToDealerSite;

    @OneToMany(() => Invoice, (invoices) => invoices.vdsbs)
    public invoices: Array<Invoice>;

    @OneToMany(() => Payment, (payment) => payment.vdsbs)
    public payments: Array<Payment>;

    @OneToMany(() => PaymentMatches, (pm) => pm.vdsbs)
    public paymentMatches: Array<PaymentMatches>;

    @OneToMany(() => Deposit, (deposit) => deposit.vdsbs)
    public deposits: Array<Deposit>;

    @OneToMany(() => Advance, (advance) => advance.vdsbs)
    public advances: Array<Advance>;

    @OneToMany(
        () => DealerRouteUser,
        (dealerUserRoute) => dealerUserRoute.vdsbs
    )
    public dealerRouteUsers: Array<DealerRouteUser>;

    @OneToMany(() => PaymentSchedule, (ps) => ps.vdsbs)
    public paymentSchedules: Array<PaymentSchedule>;
}
