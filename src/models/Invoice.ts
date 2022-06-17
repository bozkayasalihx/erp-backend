import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    RelationId,
} from "typeorm";
import { InvoiceStatusType } from "../types/types";
import InvoiceInterface from "./InvoiceInterface";
import InvoiceLine from "./InvoiceLine";
import PaymentSchedule from "./PaymentSchedule";
import SuperEntity from "./SuperEntity";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("invoices")
@Index(["invoice_no", "vdsbs_id"], { unique: true })
export default class Invoice extends SuperEntity {
    /**Properties */
    @Column({ type: "varchar", length: 30 })
    public invoice_no: string;

    @Column({ type: "date" })
    public invoice_date: Date;

    @Column({ type: "real" })
    public amount: number;

    @Column({ type: "varchar", length: 3 })
    public currency: string;

    @Column({ type: "date" })
    public due_date: Date;

    @Column("int", { array: true, default: [] })
    public ref_user_list: Array<number>;

    @Column({
        type: "enum",
        enum: InvoiceStatusType,
        default: InvoiceStatusType.PENDING_APPROVAL,
    })
    public status: InvoiceStatusType;

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
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @OneToMany(
        () => InvoiceInterface,
        (InvoiceInterface) => InvoiceInterface.invoice
    )
    @JoinColumn({ name: "ref_intf_id" })
    public invoiceInterfaces: Array<InvoiceInterface>;

    @RelationId((invoice: Invoice) => invoice.vdsbs)
    @Column({ name: "vdsbs_id" })
    public vdsbs_id: number;

    @OneToMany(() => InvoiceLine, (invoicesLine) => invoicesLine.invoice, {
        nullable: false,
    })
    public invoices_lines: Array<InvoiceLine>;

    @OneToMany(
        () => PaymentSchedule,
        (paymentSchedule) => paymentSchedule.invoice
    )
    public payment_schedules: Array<PaymentSchedule>;
}
