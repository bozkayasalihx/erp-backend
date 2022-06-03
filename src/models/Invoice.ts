import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { InvoiceStatusType } from "../types/types";
import InvoiceInterface from "./InvoiceInterface";
import InvoiceLine from "./InvoiceLine";
import SuperEntity from "./SuperEntity";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("invoices")
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

    @OneToMany(
        () => InvoiceInterface,
        (InvoiceInterface) => InvoiceInterface.invoice
    )
    @JoinColumn({ name: "ref_file_id" })
    public invoiceInterfaces: Array<InvoiceInterface>;

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

    @OneToMany(() => InvoiceLine, (invoicesLine) => invoicesLine.invoice, {
        nullable: false,
    })
    public invoices_lines: Array<InvoiceLine>;
}
