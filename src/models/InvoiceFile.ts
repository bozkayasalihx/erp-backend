import { Column, Entity } from "typeorm";
import { FileStatusType, LineStatusType } from "../types/types";
import BaseInvoice from "./BaseInvocie";

@Entity("invoice_files")
export default class InvoiceFile extends BaseInvoice {
    @Column({ type: "enum", enum: FileStatusType })
    file_status: FileStatusType;

    @Column({ type: "enum", enum: LineStatusType })
    line_status: LineStatusType;
}