import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Currency, DepositStatusType } from "../types";
import { DepositLine, VendorToDealerSiteToBuyerSite } from "./index";
import SuperEntity from "./SuperEntity";

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
    public approvalDate: Date;

    /** relations */
    @ManyToOne(() => VendorToDealerSiteToBuyerSite, (vdsbs) => vdsbs.deposits)
    @JoinColumn({ name: "vdsbs_id" })
    public vdsbs: VendorToDealerSiteToBuyerSite;

    @OneToMany(() => DepositLine, (depositLine) => depositLine.deposit)
    public depositLines: Array<DepositLine>;
}
