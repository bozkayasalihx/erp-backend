import { Column, Entity, ManyToOne } from "typeorm";
import { FileRecordType, FileStatusType, LineStatusType } from "../types/types";
import Invoice from "./Invoice";
import SuperEntity from "./SuperEntity";

@Entity("invoice_interface")
export default class InvoiceInterface extends SuperEntity {
    @Column({ type: "enum", enum: FileStatusType, default: FileStatusType.NEW })
    file_status: FileStatusType;

    @Column({ type: "enum", enum: LineStatusType, default: LineStatusType.NEW })
    line_status: LineStatusType;

    @Column({ type: "int", name: "file_process_id" })
    public file_process_id: number;

    @Column({ type: "varchar", name: "file_name", length: 100 })
    public file_name: string;

    @Column({
        name: "record_type",
        enum: FileRecordType,
        default: FileRecordType.LINE,
    })
    public record_type: FileRecordType;

    @Column({ name: "invoice_no", length: 30 })
    public invoice_no: string;

    @Column({ name: "vdsbs_id" })
    public vdsbs_id: number;

    @Column({ name: "invoice_date", type: "varchar", default: null })
    public invoice_date: string;

    @Column({ name: "due_date", type: "varchar", default: null })
    public due_date: string;

    @Column({ name: "amount", type: "varchar", length: 20 })
    public amount: string;

    @Column({ name: "currency", length: 3, type: "varchar" })
    public currency: string;

    @Column({ name: "line_no", length: 3, type: "varchar", default: null })
    public line_no: string;

    @Column({ name: "error_desc", length: 500, default: null })
    public error_desc: string;

    @ManyToOne(() => Invoice, (invoice) => invoice.invoiceInterfaces)
    public invoice: Invoice;

    @Column("int", { array: true, default: null })
    public related_users: number[];
}
