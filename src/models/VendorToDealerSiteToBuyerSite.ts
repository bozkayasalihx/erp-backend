import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    RelationId,
} from "typeorm";
import Advance from "./Advance";
import BuyerSite from "./BuyerSite";
import DealerRouteUser from "./DealerRouteUser";
import Deposit from "./Deposit";
import Invoices from "./Invoices";
import Payments from "./Payment";
import PaymentMatches from "./PaymentMatches";
import SuperEntity from "./SuperEntity";
import VendorToDealerSite from "./VendorToDealerSite";
@Entity("vdsbs_relations")
@Index(["vds_rltn_id", "buyer_site_id"], { unique: true })
export default class VendorToDealerSiteToBuyerSite extends SuperEntity {
    /**Properties */
    @Column({
        type: "varchar",
        length: 240,
        default: null,
        name: "description",
    })
    public description: string;

    /** relations */
    @ManyToOne(() => BuyerSite, (buyerSite) => buyerSite.vToDS)
    public buyerSites: Array<BuyerSite>;

    @ManyToOne(() => VendorToDealerSite, (vToDS) => vToDS.vToDsBs)
    public vToDS: Array<VendorToDealerSite>;

    @RelationId((vToDsBs: VendorToDealerSiteToBuyerSite) => vToDsBs.buyerSites)
    @Column({ name: "buyer_site_id" })
    public buyer_site_id: number;

    @RelationId((vToDsBs: VendorToDealerSiteToBuyerSite) => vToDsBs.vToDS)
    @Column({ name: "vds_rltn_id" })
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
