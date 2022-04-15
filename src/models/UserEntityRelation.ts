import { BeforeInsert, Column, Entity, ManyToOne, RelationId } from "typeorm";
import { appDataSource } from "../loaders";
import { UserTypes } from "../types/types";
import BaseEntity from "./BaseEntity";
import BuyerSite from "./BuyerSite";
import DealerSite from "./DealerSite";
import User from "./User";
import Vendor from "./Vendor";
// import MiddleSolution from "./ViewEntity";

@Entity("user_entity_relation")
export default class UserEntityRelation extends BaseEntity {
    @Column({ type: "varchar", length: 240, name: "description" })
    description: string;

    @ManyToOne(() => User)
    users: Array<User>;

    @RelationId((uEnRelation: UserEntityRelation) => uEnRelation.users)
    @Column({ name: "user_id" })
    user_id: number;

    @ManyToOne(() => Vendor, { nullable: true })
    vendor_ref_table: Vendor;

    @ManyToOne(() => BuyerSite, { nullable: true })
    bs_ref_table: BuyerSite;

    @ManyToOne(() => Vendor, { nullable: true })
    ds_ref_table: DealerSite;

    @RelationId((UERelation: UserEntityRelation) => UERelation.vendor_ref_table)
    @Column({ nullable: true, name: "vendor_ref_table_id" })
    private vendor_ref_table_id: number;

    @RelationId((UERelation: UserEntityRelation) => UERelation.bs_ref_table)
    @Column({ nullable: true, name: "bs_ref_table_id" })
    private bs_ref_table_id: number;

    @RelationId((UERelation: UserEntityRelation) => UERelation.ds_ref_table)
    @Column({ nullable: true, name: "ds_ref_table_id" })
    private ds_ref_table_id: number;

    @Column({ nullable: true, name: "ref_entity_id" })
    ref_entity_id: number;

    @BeforeInsert()
    private async afterInsert() {
        const results: [{ user_type: UserTypes; id: number }] =
            await appDataSource.manager.query(
                `select user_type, id from user_tbl where id = ${this.user_id}`
            );

        if (!results) throw new Error("not such as user");

        if (
            results[0].user_type === UserTypes.VENDOR ||
            results[0].user_type === UserTypes.VENDOR_ADMIN
        ) {
            this.vendor_ref_table_id = this.ref_entity_id;
        }

        if (
            results[0].user_type === UserTypes.BUYER ||
            results[0].user_type === UserTypes.BUYER_ADMIN
        ) {
            this.bs_ref_table_id = this.ref_entity_id;
        }

        if (
            results[0].user_type === UserTypes.DEALER ||
            results[0].user_type === UserTypes.DEALER_ADMIN
        ) {
            this.ds_ref_table_id = this.ref_entity_id;
        }
    }
}

// vendor => vendor.id
// dealer_site => dealer_site.id
// buyer_site => buyer_site.id

// katmanli mimari olmasi lazjim
// type = vendor => vendor.id
//        dealer_site => dealer_site.id
//        buyer_site  => buyer_site.id
