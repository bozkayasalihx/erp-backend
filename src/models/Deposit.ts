import { Column, Entity } from "typeorm";
import { Currency, DepositStatusType } from "../types/types";
import SuperEntity from "./SuperEntity";

@Entity("deposits")
export default class Deposit extends SuperEntity {
    @Column({ type: "real" })
    public amount: number;

    @Column({ length: 3, type: "varchar" })
    public currency: Currency;

    @Column({ type: "enum", enum: DepositStatusType })
    public status: DepositStatusType;

    @Column({ type: "timestamp", default: null })
    public approval_date: Date;

    /** relations */

    // @ManyToOne(() => VendorToDealerSiteToBuyerSite, (vdsbs) => vdsbs.deposits)
    // @JoinColumn({ name: "vdsbs_id" })
    // public vdsbs: VendorToDealerSiteToBuyerSite;
}
