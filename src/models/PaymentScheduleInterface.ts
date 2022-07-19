import { Column, Entity, OneToMany } from "typeorm";
import { Currency, FileStatusType, LineStatusType } from "../types";
import PaymentSchedule from "./PaymentSchedule";
import SuperEntity from "./SuperEntity";

@Entity("ps_interface")
export default class PaymentScheduleInteface extends SuperEntity {
    @Column({ type: "int", name: "file_process_id" })
    public file_process_id: number;

    @Column({ type: "varchar", name: "file_name", length: 100 })
    public file_name: string;

    @Column({ type: "enum", enum: FileStatusType, default: FileStatusType.NEW })
    public file_status?: FileStatusType;

    @Column({ type: "varchar", length: 30 })
    public invoice_no: string;

    @Column({ length: 10 })
    public vdsbs_id: string;

    @Column({
        name: "line_no",
        length: 3,
        type: "varchar",
        default: null,
    })
    public line_no?: string;

    @Column({ name: "due_date", type: "varchar", default: null })
    public due_date?: string;

    @Column({ name: "amount", type: "varchar", length: 20, default: null })
    public due_amount?: string;

    @Column({
        name: "currency",
        length: 3,
        type: "varchar",
        default: Currency.TRY,
    })
    public currency?: string;

    @Column({ type: "enum", enum: LineStatusType, default: LineStatusType.NEW })
    public line_status?: LineStatusType;

    @Column({ name: "error_desc", length: 500, default: null })
    public error_desc?: string;

    @OneToMany(() => PaymentSchedule, (ps) => ps.paymentScheduleInterface)
    public paymentSchedules: Array<PaymentSchedule>;
}
