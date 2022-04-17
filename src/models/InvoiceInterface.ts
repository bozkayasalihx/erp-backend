import { Column, Entity } from "typeorm";
import BaseInvoice from "./BaseInvoice";

@Entity("invoice_interface")
export default class InvoiceInterface extends BaseInvoice {
    @Column({ type: "varchar", length: 3 })
    file_status: string;

    @Column({ type: "varchar", length: 3 })
    line_status: string;
}
