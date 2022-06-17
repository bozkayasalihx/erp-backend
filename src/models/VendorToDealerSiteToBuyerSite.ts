import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import Advance from "./Advance";
import BuyerSite from "./BuyerSite";
import DealerRouteUser from "./DealerRouteUser";
import Deposit from "./Deposit";
import Invoices from "./Invoice";
import Payments from "./Payment";
import PaymentMatches from "./PaymentMatches";
import PaymentSchedule from "./PaymentSchedule";
import SuperEntity from "./SuperEntity";
import VendorToDealerSite from "./VendorToDealerSite";
@Entity("vdsbs_relations")
@Index(["buyerSite.id", "vToDS.id"], { unique: true })
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
    @ManyToOne(() => BuyerSite, (buyerSite) => buyerSite.vToDSBS)
    @JoinColumn({ name: "buyer_site_id" })
    public buyerSite: BuyerSite;

    @ManyToOne(() => VendorToDealerSite, (vToDS) => vToDS.vToDsBs)
    @JoinColumn({ name: "vds_rltn_id" })
    public vToDS: VendorToDealerSite;

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

    @OneToMany(() => PaymentSchedule, (ps) => ps.vdsbs)
    public paymentSchedules: Array<PaymentSchedule>;
}
