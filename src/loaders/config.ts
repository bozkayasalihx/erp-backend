import { InvoiceInterface, PaymentScheduleInterface } from "../models";
import { appDataSource } from "./database";

export default function config() {
    const connectDb = async () => {
        await appDataSource.initialize();
        await appDataSource
            .getRepository(InvoiceInterface)
            .query(
                `CREATE SEQUENCE IF NOT EXISTS invoice_file_process_id INCREMENT 1 START 1;`
            );
        await appDataSource
            .getRepository(PaymentScheduleInterface)
            .query(
                `CREATE SEQUENCE IF NOT EXISTS ps_file_process_id INCREMENT 1 START 1;`
            );

        /*
        await appDataSource.query(`
    create or replace view user_entity_relations_v as
    select uer.id uer_id,
           uer.description description_uer,
           uer.user_id,
           uer.vendor_table_ref_id,
           uer.dealer_site_table_ref_id,
           uer.buyer_site_table_ref_id,
           uer.start_date start_date_uer,
           uer.end_date end_date_uer,
           u.username, u.user_type,
           u.start_date start_date_user,
           u.end_date end_date_user
      from user_entity_relations uer
      join users u
        on u.id = uer.user_id
     where 1=1;`);
        */
        /*
        await appDataSource.query(`
    create or replace view vendor_dealer_buyer_rltns_v as
    select vdbrl.id as vdsbs_id, vdbrl.description as description_vdsbs,
           vdbrl.start_date as start_date_vdsbs, vdbrl.end_date as end_date_vdsbs,
           vdrl.vds_id, vdrl.start_date_vds, vdrl.end_date_vds,
           vdrl.vendor_id, vdrl.vendor_name,
           vdrl.start_date_vendor, vdrl.end_date_vendor,
           vdrl.ds_id as dealer_site_id, vdrl.ds_name dealer_site_name,
           vdrl.start_date_ds, vdrl.end_date_ds,
           vdrl.dealer_id, vdrl.dealer_name,
           vdrl.start_date_d as start_date_dealer, vdrl.end_date_d as end_date_dealer,
           bsv.bs_id as buyer_site_id, bsv.bs_name buyer_site_name,
           bsv.start_date_bs, bsv.end_date_bs,
           bsv.buyer_id, bsv.buyer_name,
           bsv.start_date_buyer, bsv.end_date_buyer
      from vdsbs_relations vdbrl
      join (select vds.id as vds_id,
                   vds.start_date as start_date_vds,
                   vds.end_date as end_date_vds,
                   vds.vendor_id, v.name as vendor_name,
                   v.start_date as start_date_vendor,
                   v.end_date as end_date_vendor,
                   dsv.ds_id, dsv.ds_name,
                   dsv.start_date_d, dsv.end_date_d,
                   dsv.dealer_id, dsv.dealer_name,
                   dsv.start_date_ds, dsv.end_date_ds
              from vds_relations vds
              join vendors v
                on v.id = vds.vendor_id
              join (select ds.id as ds_id, ds.name as ds_name,
                           ds.start_date as start_date_ds, ds.end_date as end_date_ds,
                           d.id as dealer_id, d.name as dealer_name,
                           d.start_date as start_date_d, d.end_date as end_date_d
                      from dealer_sites ds
                      join dealers d
                        on d.id = ds.dealer_id
                     where 1=1) dsv
                on dsv.ds_id = vds.dealer_site_id
             where 1=1) vdrl
        on vdrl.vds_id = vdbrl.vds_rltn_id
      join (select bs.id as bs_id, bs.name as bs_name,
                   bs.start_date as start_date_bs, bs.end_date as end_date_bs,
                   b.name as buyer_name, b.id as buyer_id,
                   b.start_date as start_date_buyer, b.end_date as end_date_buyer
              from buyer_sites bs
              join buyers b
                on b.id = bs.buyer_id
             where 1=1) bsv
        on bsv.bs_id = vdbrl.buyer_site_id
     where 1=1;
     `);
        */
        /*
        await appDataSource.query(`
    create or replace view user_entity_access_v as
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
     where 1=1;
    `);
    */
    };

    return Promise.all([connectDb()]);
}
