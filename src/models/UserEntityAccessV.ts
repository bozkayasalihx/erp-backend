import { ViewColumn, ViewEntity } from "typeorm";
import { UserEntityRelationsV, VendorDealerBuyerRltnsV } from "./";

@ViewEntity("user_entity_access_v", {
    expression: `
        select usr_rltns.uer_id, usr_rltns.description_uer,
                usr_rltns.start_date_uer, usr_rltns.end_date_uer,
                usr_rltns.user_id, usr_rltns.username, usr_rltns.user_type,
                usr_rltns.start_date_user, usr_rltns.end_date_user,
                entity_rltns.vdsbs_id, entity_rltns.description_vdsbs, 
                entity_rltns.start_date_vdsbs, entity_rltns.end_date_vdsbs,
                entity_rltns.vds_id, entity_rltns.start_date_vds, entity_rltns.end_date_vds,
                entity_rltns.vendor_id, entity_rltns.vendor_name,
                entity_rltns.start_date_vendor, entity_rltns.end_date_vendor,
                entity_rltns.dealer_site_id, entity_rltns.dealer_site_name,
                entity_rltns.start_date_ds, entity_rltns.end_date_ds,
                entity_rltns.dealer_id, entity_rltns.dealer_name,
                entity_rltns.start_date_dealer, entity_rltns.end_date_dealer,
                entity_rltns.buyer_site_id, entity_rltns.buyer_site_name,
                entity_rltns.start_date_bs, entity_rltns.end_date_bs,
                entity_rltns.buyer_id, entity_rltns.buyer_name,
                entity_rltns.start_date_buyer, entity_rltns.end_date_buyer
        from user_entity_relations_v usr_rltns
        join vendor_dealer_buyer_rltns_v entity_rltns
            on (case when usr_rltns.user_type in ('V','VA')
                        then entity_rltns.vendor_id
                end = usr_rltns.vendor_table_ref_id
            or case when usr_rltns.user_type in ('D','DA')
                        then entity_rltns.dealer_site_id
                end = usr_rltns.dealer_site_table_ref_id
            or case when usr_rltns.user_type in ('B','BA')
                        then entity_rltns.buyer_site_id
                end = usr_rltns.buyer_site_table_ref_id)
        where 1=1
        UNION
        select 0 as uer_id, 'Site Admin default' description_uer,
                null as start_date_uer, null as end_date_uer,
                u.id as user_id, u.username, u.user_type,
                u.start_date as start_date_user, u.end_date as end_date_user,
                entity_rltns.vdsbs_id, entity_rltns.description_vdsbs, 
                entity_rltns.start_date_vdsbs, entity_rltns.end_date_vdsbs,
                entity_rltns.vds_id, entity_rltns.start_date_vds, entity_rltns.end_date_vds,
                entity_rltns.vendor_id, entity_rltns.vendor_name,
                entity_rltns.start_date_vendor, entity_rltns.end_date_vendor,
                entity_rltns.dealer_site_id, entity_rltns.dealer_site_name,
                entity_rltns.start_date_ds, entity_rltns.end_date_ds,
                entity_rltns.dealer_id, entity_rltns.dealer_name,
                entity_rltns.start_date_dealer, entity_rltns.end_date_dealer,
                entity_rltns.buyer_site_id, entity_rltns.buyer_site_name,
                entity_rltns.start_date_bs, entity_rltns.end_date_bs,
                entity_rltns.buyer_id, entity_rltns.buyer_name,
                entity_rltns.start_date_buyer, entity_rltns.end_date_buyer
        from users u
        join vendor_dealer_buyer_rltns_v entity_rltns
            on 1=1
        where 2=2
            and u.user_type in ('SA');
        `,
    dependsOn: [UserEntityRelationsV, VendorDealerBuyerRltnsV],
})
export default class UserEntityAccessV {
    @ViewColumn()
    uer_id: number;

    @ViewColumn()
    description_uer: string;

    @ViewColumn()
    start_date_uer: Date;

    @ViewColumn()
    end_date_uer: Date;

    @ViewColumn()
    user_id: number;

    @ViewColumn()
    username: string;

    @ViewColumn()
    user_type: string;

    @ViewColumn()
    start_date_user: Date;

    @ViewColumn()
    end_date_user: Date;

    @ViewColumn()
    vdsbs_id: number;

    @ViewColumn()
    description_vdsbs: string;

    @ViewColumn()
    start_date_vdsbs: Date;

    @ViewColumn()
    end_date_vdsbs: Date;

    @ViewColumn()
    vds_id: number;

    @ViewColumn()
    start_date_vds: Date;

    @ViewColumn()
    end_date_vds: Date;

    @ViewColumn()
    vendor_id: number;

    @ViewColumn()
    vendor_name: string;

    @ViewColumn()
    start_date_vendor: Date;

    @ViewColumn()
    end_date_vendor: Date;

    @ViewColumn()
    dealer_site_id: number;

    @ViewColumn()
    dealer_site_name: string;

    @ViewColumn()
    start_date_ds: Date;

    @ViewColumn()
    end_date_ds: Date;

    @ViewColumn()
    dealer_id: number;

    @ViewColumn()
    dealer_name: string;

    @ViewColumn()
    start_date_dealer: Date;

    @ViewColumn()
    end_date_dealer: Date;

    @ViewColumn()
    buyer_site_id: number;

    @ViewColumn()
    buyer_site_name: string;

    @ViewColumn()
    start_date_bs: Date;

    @ViewColumn()
    end_date_bs: Date;

    @ViewColumn()
    buyer_id: number;

    @ViewColumn()
    buyer_name: string;

    @ViewColumn()
    start_date_buyer: Date;

    @ViewColumn()
    end_date_buyer: Date;
}
