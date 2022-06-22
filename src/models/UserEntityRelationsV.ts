import { ViewColumn, ViewEntity } from "typeorm";
import { User, UserEntityRelation } from "./";

// @ViewEntity("user_entity_relations_v", {
//     expression: `
//         select uer.id uer_id,
//                uer.description description_uer,
//                uer.user_id,
//                uer.vendor_table_ref_id,
//                uer.dealer_site_table_ref_id,
//                uer.buyer_site_table_ref_id,
//                uer.start_date start_date_uer,
//                uer.end_date end_date_uer,
//                u.username, u.user_type,
//                u.start_date start_date_user,
//                u.end_date end_date_user
//           from user_entity_relations uer
//           join users u
//             on u.id = uer.user_id
//          where 1=1;`,
//     dependsOn: [UserEntityRelation, User],
// })
export default class UserEntityRelationsV {
    @ViewColumn()
    uer_id: number;

    @ViewColumn()
    description_uer: string;

    @ViewColumn()
    user_id: number;

    @ViewColumn()
    vendor_table_ref_id: number;

    @ViewColumn()
    dealer_site_table_ref_id: number;

    @ViewColumn()
    buyer_site_table_ref_id: number;

    @ViewColumn()
    start_date_uer: Date;

    @ViewColumn()
    end_date_uer: Date;

    @ViewColumn()
    username: string;

    @ViewColumn()
    user_type: string;

    @ViewColumn()
    start_date_user: Date;

    @ViewColumn()
    end_date_user: Date;
}
