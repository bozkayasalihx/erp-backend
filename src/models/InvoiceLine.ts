import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Invoices from "./Invoice";
import SuperEntity from "./SuperEntity";

@Entity("invoice_lines")
export default class InvoiceLine extends SuperEntity {
    @Column({ type: "int" })
    public line_no: number;

    @Column({ type: "real" })
    //TODO: convert real data type to typescript type
    public amount: number;

    @Column({ length: 3 })
    public currency: string;

    @Column()
    public item_quantity: number;

    @Column({ length: 20 })
    public item_uom: string;

    @Column({ length: 100, nullable: true })
    public item_desc: string;

    // relations
    @ManyToOne(() => Invoices, (invoices) => invoices.invoices_lines)
    @JoinColumn({ name: "invoice_id" })
    public invoice: Invoices;
}
