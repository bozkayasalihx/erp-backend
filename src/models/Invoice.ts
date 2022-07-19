import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    RelationId,
} from "typeorm";
import { InvoiceStatusType } from "../types";
import {
    InvoiceInterface,
    PaymentSchedule,
    VendorToDealerSiteToBuyerSite,
} from "./index";
import InvoiceLine from "./InvoiceLine";
import SuperEntity from "./SuperEntity";

@Entity("invoices")
@Index(["invoiceNo", "vdsbsId"], { unique: true })
export default class Invoice extends SuperEntity {
    /** Properties */
    @Column({ type: "varchar", length: 30 })
    public invoiceNo: string;

    @Column({ type: "date" })
    public invoiceDate: Date;

    @Column({ type: "real" })
    public amount: number;

    @Column({ type: "varchar", length: 3 })
    public currency: string;

    @Column({ type: "date" })
    public dueDate: Date;

    @Column("int", { array: true, default: [] })
    public refUserList: Array<number>;

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

    @OneToMany(() => InvoiceInterface, (invoiceIn) => invoiceIn.invoice)
    @JoinColumn({ name: "ref_intf_id" })
    public invoiceInterfaces: Array<InvoiceInterface>;

    @RelationId((invoice: Invoice) => invoice.vdsbs)
    @Column({ name: "vdsbs_id" })
    public vdsbsId: number;

    @OneToMany(() => InvoiceLine, (invoicesLine) => invoicesLine.invoice, {
        nullable: false,
    })
    public invoicesLines: Array<InvoiceLine>;

    @OneToMany(
        () => PaymentSchedule,
        (paymentSchedule) => paymentSchedule.invoice
    )
    public paymentSchedules: Array<PaymentSchedule>;
}
