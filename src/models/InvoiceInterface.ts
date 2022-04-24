import { Column, Entity } from "typeorm";
import { FileStatusType, LineStatusType } from "../types/types";
import BaseInvoice from "./BaseInvoice";

@Entity("invoice_interface")
export default class InvoiceInterface extends BaseInvoice {
    @Column({ type: "enum", enum: FileStatusType })
    file_status: FileStatusType;

    @Column({ type: "enum", enum: LineStatusType })
    line_status: LineStatusType;
}
