import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import Payments from "./Payment";
import PaymentSchedule from "./PaymentSchedule";
import SuperEntity from "./SuperEntity";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("payment_matches")
export default class PaymentMatches extends SuperEntity {
    @Column({ type: "varchar", length: 3 })
    public currency: string;

    @Column({ type: "real" })
    public matches_amount: number;

    /** Relations*/

    @ManyToOne(() => PaymentSchedule, (ps) => ps.payment_matches)
    @JoinColumn({ name: "payment_schedule_id" })
    public payment_schedule: PaymentSchedule;

    @ManyToOne(() => Payments, (payments) => payments.payment_matches)
    @JoinColumn({ name: "payment_id" })
    public payments: Payments;

    @ManyToOne(
        () => VendorToDealerSiteToBuyerSite,
        (vdsbs) => vdsbs.payment_matches
    )
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;
}
