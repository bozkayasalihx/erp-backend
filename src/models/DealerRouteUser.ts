import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { VendorToDealerSiteToBuyerSite } from "./index";
import SuperEntity from "./SuperEntity";
import User from "./User";

@Entity("dealer_route_users")
@Index(["user.id", "vdsbs.id"], { unique: true })
export default class DealerRouteUser extends SuperEntity {
    @Column({ length: 240, nullable: true })
    public description: string;

    @ManyToOne(
        () => VendorToDealerSiteToBuyerSite,
        (vdsbs) => vdsbs.dealerRouteUsers
    )
    @JoinColumn({ name: "vdsbs_id" })
    vdsbs: VendorToDealerSiteToBuyerSite;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    public user: User;
}
