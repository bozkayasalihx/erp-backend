import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import SuperEntity from "./SuperEntity";
import User from "./User";
import VendorToDealerSiteToBuyerSite from "./VendorToDealerSiteToBuyerSite";

@Entity("dealer_route_users")
@Index(["vdsbs.id", "user.id"], { unique: true })
export default class DealerRouteUser extends SuperEntity {
    @Column({ length: 240 })
    public description: string;

    @ManyToOne(
        () => VendorToDealerSiteToBuyerSite,
        (vdsbs) => vdsbs.dealer_route_users
    )
    @JoinColumn({ name: "vdsbs_id" })
    vdsbs: VendorToDealerSiteToBuyerSite;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    public user: User;
}
