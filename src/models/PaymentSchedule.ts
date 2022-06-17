import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    RelationId,
} from "typeorm";
import {
    Invoice,
    PaymentScheduleInterface,
    VendorToDealerSiteToBuyerSite,
} from "../models";
import { PaymentStatusType } from "../types/types";
import PaymentMatches from "./PaymentMatches";
import SuperEntity from "./SuperEntity";

@Entity("payment_schedules")
export default class PaymentSchedule extends SuperEntity {
    @ManyToOne(() => Invoice, (invoice) => invoice.payment_schedules)
    @JoinColumn({ name: "invoice_id" })
    public invoice: Invoice;

    @Column({ name: "line_no", nullable: true })
    public line_no: number;

    @Column({ type: "date", name: "due_date" })
    public due_date: Date;

    @Column({ type: "real", nullable: false, default: 0 })
    public due_amount: number;

    @Column({ type: "real", nullable: false, default: 0 })
    public remained_amount: number;

    @Column({ type: "varchar", length: 3 })
    public currency: string;

    @Column({
        type: "enum",
        enum: PaymentStatusType,
        default: PaymentStatusType.NO_PAYMENT,
    })
    public payment_status: PaymentStatusType;

    /** relations */
    @OneToMany(() => PaymentMatches, (pm) => pm.payment_schedule)
    public payment_matches: Array<PaymentMatches>;

    @ManyToOne(() => PaymentScheduleInterface, (psi) => psi.paymentSchedules)
    @JoinColumn({
        name: "ref_intf_id",
    })
    public paymentScheduleInterface: PaymentScheduleInterface;

    @ManyToOne(
        () => VendorToDealerSiteToBuyerSite,
        (vdsbs) => vdsbs.paymentSchedules
    )
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @RelationId((ps: PaymentSchedule) => ps.vdsbs)
    @Column({ name: "vdsbs_id" })
    public vdsbs_id: number;
}
