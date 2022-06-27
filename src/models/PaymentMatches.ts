import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import {
    Payment,
    PaymentSchedule,
    VendorToDealerSiteToBuyerSite,
} from "./index";
import SuperEntity from "./SuperEntity";

@Entity("payment_matches")
export default class PaymentMatches extends SuperEntity {
    @Column({ type: "varchar", length: 3 })
    public currency: string;

    @Column({ type: "real" })
    public matchesAmount: number;

    /** Relations */

    @ManyToOne(() => PaymentSchedule, (ps) => ps.paymentMatches)
    @JoinColumn({ name: "payment_schedule_id" })
    public paymentSchedule: PaymentSchedule;

    @ManyToOne(() => Payment, (payments) => payments.paymentMatches)
    @JoinColumn({ name: "payment_id" })
    public payments: Payment;

    @ManyToOne(
        () => VendorToDealerSiteToBuyerSite,
        (vdsbs) => vdsbs.paymentMatches
    )
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;
}
