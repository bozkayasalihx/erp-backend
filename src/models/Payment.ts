import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Currency, InvoiceStatusType, PaymentType } from "../types";
import { PaymentMatches, VendorToDealerSiteToBuyerSite } from "./index";
import SuperEntity from "./SuperEntity";

@Entity("payments")
export default class Payments extends SuperEntity {
    @Column({ type: "enum", enum: PaymentType, default: PaymentType.CASH })
    public paymentType: PaymentType;

    @Column()
    public referenceId: number;

    @Column({ type: "real" })
    public originalAmount: number;

    @Column({ type: "real" })
    public remainedAmount: number;

    @Column({ type: "varchar", length: 3, default: Currency.TRY })
    public currency: Currency;

    @Column({ type: "timestamp" })
    public effectiveDate: Date;

    @Column({
        type: "enum",
        enum: InvoiceStatusType,
        default: InvoiceStatusType.PENDING_APPROVAL,
    })
    public invoicedStatus: InvoiceStatusType;

    /** relations */
    @ManyToOne(() => VendorToDealerSiteToBuyerSite, (vdsbs) => vdsbs.payments)
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @OneToMany(() => PaymentMatches, (pm) => pm.payments)
    public paymentMatches: Array<PaymentMatches>;
}
