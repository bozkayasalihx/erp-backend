import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AdvanceStatusType, AdvanceType, Currency } from "../types";
import { VendorToDealerSiteToBuyerSite } from "./index";
import SuperEntity from "./SuperEntity";

@Entity("advances")
export default class Advance extends SuperEntity {
    @Column({ type: "enum", enum: AdvanceType, default: AdvanceType.CASH })
    public advanceType: AdvanceType;

    @Column({ type: "real" })
    public amount: number;

    @Column({ type: "varchar", length: 3, default: Currency.TRY })
    public currency: Currency;

    @Column({
        type: "enum",
        enum: AdvanceStatusType,
        default: AdvanceStatusType.PENDING_APPROVAL,
    })
    public status: AdvanceStatusType;

    @Column({ type: "timestamp" })
    public approvalDate: Date;

    /** relations */
    @ManyToOne(() => VendorToDealerSiteToBuyerSite, (vdsbs) => vdsbs.advances)
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;
}
