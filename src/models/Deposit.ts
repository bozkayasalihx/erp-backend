import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Currency, DepositStatusType } from "../types/types";
import SuperEntity from "./SuperEntity";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("deposits")
export default class Deposit extends SuperEntity {
    @Column({ type: "real" })
    public amount: number;

    @Column({ length: 3, type: "varchar", default: Currency.TRY })
    public currency: Currency;

    @Column({
        type: "enum",
        enum: DepositStatusType,
        default: DepositStatusType.PENDING_APPROVAL,
    })
    public status: DepositStatusType;

    @Column({ type: "timestamp", default: null })
    public approval_date: Date;

    /** relations */

    @ManyToOne(() => VendorToDealerSiteToBuyerSite, (vdsbs) => vdsbs.deposits)
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;
}
