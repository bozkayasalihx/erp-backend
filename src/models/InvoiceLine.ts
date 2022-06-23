import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Invoices from "./Invoice";
import SuperEntity from "./SuperEntity";

@Entity("invoice_lines")
export default class InvoiceLine extends SuperEntity {
    @Column({ type: "int", nullable: true })
    public line_no: number;

    @Column({ type: "real" })
    public amount: number;

    @Column({ length: 3 })
    public currency: string;

    @Column({ name: "item_quantity", nullable: true })
    public item_quantity: number;

    @Column({ length: 20, name: "item_uom", nullable: true })
    public item_uom: string;

    @Column({ length: 100, nullable: true, name: "item_description" })
    public item_description: string;

    // relations
    @ManyToOne(() => Invoices, (invoices) => invoices.invoices_lines)
    @JoinColumn({ name: "invoice_id" })
    public invoice: Invoices;
}
