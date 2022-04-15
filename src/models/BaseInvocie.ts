import { FileRecordType } from "../types/types";
import { Column } from "typeorm";
import BaseEntity from "./BaseEntity";

export default abstract class BaseInvoice extends BaseEntity {
    @Column({ name: "file_id", type: "int" })
    file_id: number;

    @Column({ name: "file_name", type: "varchar", length: 100 })
    file_name: string;

    @Column({ name: "record_type", enum: FileRecordType })
    record_type: FileRecordType;

    @Column({ name: "invoice_no", length: 30 })
    invoice_no: string;

    @Column({ name: "vdsbs_id" })
    vdsbs_id: number;

    @Column({ name: "invoice_date", type: "timestamp" })
    invoice_date: Date;

    @Column({ name: "due_date", type: "timestamp" })
    due_date: Date;

    @Column({ name: "amount", type: "varchar", length: 20 })
    amount: string;

    @Column({ name: "currency", length: 3, type: "varchar" })
    currency: string;

    @Column({ name: "line_no", length: 3, type: "varchar" })
    line_no: string;

    @Column({ name: "erro_desc", length: 500 })
    error_desc: string;
}
