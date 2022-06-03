import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PaymentStatusType } from "../types/types";
import Invoices from "./Invoice";
import PaymentMatches from "./PaymentMatches";
import SuperEntity from "./SuperEntity";

@Entity("payment_schedules")
export default class PaymentSchedule extends SuperEntity {
    @Column({ name: "invoice_id" })
    public invoice_id: number;

    @Column({ name: "line_no" })
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

    @ManyToOne(() => Invoices)
    @JoinColumn({ name: "invoice_id" })
    public invoice: Invoices;
}
