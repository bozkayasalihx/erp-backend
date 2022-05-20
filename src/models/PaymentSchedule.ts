import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { PaymentStatusType } from "../types/types";
import Invoices from "./Invoice";
import PaymentMatches from "./PaymentMatches";
import SuperEntity from "./SuperEntity";

@Entity("payment_schedules")
export default class PaymentSchedule extends SuperEntity {
    @Column()
    public invoice_id: number;

    @Column()
    public line_no: number;

    @Column({ type: "timestamp" })
    public due_date: Date;

    @Column({ type: "real" })
    public due_amount: number;

    @Column({ type: "real" })
    public remanined_amount: number;

    @Column({ type: "varchar", length: 3 })
    public currency: string;

    @Column({ type: "enum", enum: PaymentStatusType })
    public payment_status: PaymentStatusType;

    /** relations */

    @OneToMany(() => PaymentMatches, (pm) => pm.payment_schedule)
    public payment_matches: Array<PaymentMatches>;

    @ManyToOne(() => Invoices, (invoices) => invoices.payment_schedules)
    public invoices: Invoices;
}
