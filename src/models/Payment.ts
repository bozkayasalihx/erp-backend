import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Currency, InvoiceStatusType, PaymentType } from "../types/types";
import PaymentMatches from "./PaymentMatches";
import SuperEntity from "./SuperEntity";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("payments")
export default class Payments extends SuperEntity {
    @Column({ type: "enum", enum: PaymentType, default: PaymentType.CASH })
    public payment_type: PaymentType;

    @Column()
    public reference_id: number;

    @Column({ type: "real" })
    public original_amount: number;

    @Column({ type: "real" })
    public remained_amount: number;

    @Column({ type: "varchar", length: 3, default: Currency.TRY })
    public currency: Currency;

    @Column({ type: "timestamp" })
    public effective_date: Date;

    @Column({
        type: "enum",
        enum: InvoiceStatusType,
        default: InvoiceStatusType.PENDING_APPROVAL,
    })
    public invoiced_status: InvoiceStatusType;

    /** relations */

    @ManyToOne(() => VendorToDealerSiteToBuyerSite, (vdsbs) => vdsbs.payments)
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @OneToMany(() => PaymentMatches, (pm) => pm.payments)
    public payment_matches: Array<PaymentMatches>;
}
