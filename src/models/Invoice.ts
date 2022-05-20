import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { InvoiceStatusType } from "../types/types";
import InvoiceLine from "./InvoiceLine";
import PaymentSchedule from "./PaymentSchedule";
import SuperEntity from "./SuperEntity";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("invoices")
export default class Invoice extends SuperEntity {
    /**Properties */
    @Column({ type: "varchar", length: 30 })
    public invoice_no: string;

    @Column({ type: "timestamp" })
    public invoice_date: Date;

    @Column({ type: "real" })
    public invoice_amount: number;

    @Column({ type: "varchar", length: 3 })
    public currency: string;

    @Column({ type: "timestamp" })
    public due_date: Date;

    @Column({ type: "enum", enum: InvoiceStatusType })
    public status: InvoiceStatusType;

    @Column({ type: "int" })
    public ref_file_id: number;

    @Column({ type: "varchar", length: 150, nullable: true })
    public attribute1: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    public attribute2: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    public attribute3: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    public attribute4: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    public attribute5: string;

    /** RElations */

    @ManyToOne(() => VendorToDealerSiteToBuyerSite, (vdsbs) => vdsbs.invoices)
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @OneToMany(() => PaymentSchedule, (ps) => ps.invoices, { nullable: false })
    @JoinColumn({ name: "payment_schedule_ids" })
    public payment_schedules: Array<PaymentSchedule>;

    @OneToMany(() => InvoiceLine, (invoicesLine) => invoicesLine.invoice, {
        nullable: false,
    })
    @JoinColumn({ name: "invoice_lines_ids" })
    public invoices_lines: Array<InvoiceLine>;
}
