import { Column } from "typeorm";
import { FileRecordType } from "../types/types";
import SuperEntity from "./SuperEntity";

export default abstract class BaseInvoice extends SuperEntity {
    @Column({ name: "record_type", enum: FileRecordType })
    public record_type: FileRecordType;

    @Column({ name: "invoice_no", length: 30 })
    public invoice_no: string;

    @Column({ name: "vdsbs_id" })
    public vdsbs_id: number;

    @Column({ name: "invoice_date", type: "timestamp", default: null })
    public invoice_date: Date;

    @Column({ name: "due_date", type: "timestamp", default: null })
    public due_date: Date;

    @Column({ name: "amount", type: "varchar", length: 20 })
    public amount: string;

    @Column({ name: "currency", length: 3, type: "varchar" })
    public currency: string;

    @Column({ name: "line_no", length: 3, type: "varchar" })
    public line_no: string;

    @Column({ name: "erro_desc", length: 500 })
    public error_desc: string;
}
