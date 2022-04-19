import { Column, ManyToOne } from "typeorm";
import { InvoiceStatusType } from "../types/types";
import SuperEntity from "./BaseEntity";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

export default class Invoices extends SuperEntity {
    /**Properties */
    @Column({ type: "varchar", length: 30 })
    invoice_no: string;

    @Column({ type: "timestamp" })
    invoice_date: Date;

    @Column({ type: "real" })
    invoice_amount: number;

    @Column({ type: "varchar", length: 3 })
    currency: string;

    @Column({ type: "enum", enum: InvoiceStatusType })
    status: InvoiceStatusType;

    @Column({ type: "int" })
    ref_file_id: number;

    @Column({ type: "varchar", length: 150 })
    attribute: string;

    @Column({ type: "varchar", length: 150 })
    attribute2: string;

    @Column({ type: "varchar", length: 150 })
    attribute3: string;

    @Column({ type: "varchar", length: 150 })
    attribute4: string;

    @Column({ type: "varchar", length: 150 })
    attribute5: string;

    /** RElations */

    @ManyToOne(() => VendorToDealerSiteToBuyerSite)
    vdsbs: VendorToDealerSiteToBuyerSite;
}
