import { Column, Entity } from "typeorm";
import { FileStatusType, LineStatusType } from "../types/types";
import SuperEntity from "./SuperEntity";

@Entity("ps_interface")
export default class PaymentScheduleInteface extends SuperEntity {
    @Column()
    file_process_id: number;

    @Column({ length: 100 })
    file_name: string;

    @Column({ type: "enum", enum: FileStatusType })
    file_status: FileStatusType;

    @Column({ type: "varchar", length: 30 })
    invoice_no: string;

    @Column({ length: 10 })
    vdsbs_id: string;

    @Column({ length: 3 })
    line_no: string;

    @Column({ length: 20 })
    due_date: string;

    @Column({ length: 20 })
    amount: string;

    @Column({ length: 3 })
    currency: string;

    @Column({ type: "enum", enum: LineStatusType })
    line_status: LineStatusType;

    @Column({ length: 500 })
    error_desc: string;
}
