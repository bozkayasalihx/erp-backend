import { ViewColumn } from "typeorm";

// @ViewEntity("vendor_dealer_buyer_rltns_v", {
//     expression: `
//     select vdbrl.id as vdsbs_id, vdbrl.description as description_vdsbs,
//            vdbrl.start_date as start_date_vdsbs, vdbrl.end_date as end_date_vdsbs,
//            vdrl.vds_id, vdrl.start_date_vds, vdrl.end_date_vds,
//            vdrl.vendor_id, vdrl.vendor_name,
//            vdrl.start_date_vendor, vdrl.end_date_vendor,
//            vdrl.ds_id as dealer_site_id, vdrl.ds_name dealer_site_name,
//            vdrl.start_date_ds, vdrl.end_date_ds,
//            vdrl.dealer_id, vdrl.dealer_name,
//            vdrl.start_date_d as start_date_dealer, vdrl.end_date_d as end_date_dealer,
//            bsv.bs_id as buyer_site_id, bsv.bs_name buyer_site_name,
//            bsv.start_date_bs, bsv.end_date_bs,
//            bsv.buyer_id, bsv.buyer_name,
//            bsv.start_date_buyer, bsv.end_date_buyer
//       from vdsbs_relations vdbrl
//       join (select vds.id as vds_id,
//                    vds.start_date as start_date_vds,
//                    vds.end_date as end_date_vds,
//                    vds.vendor_id, v.name as vendor_name,
//                    v.start_date as start_date_vendor,
//                    v.end_date as end_date_vendor,
//                    dsv.ds_id, dsv.ds_name,
//                    dsv.start_date_d, dsv.end_date_d,
//                    dsv.dealer_id, dsv.dealer_name,
//                    dsv.start_date_ds, dsv.end_date_ds
//               from vds_relations vds
//               join vendors v
//                 on v.id = vds.vendor_id
//               join (select ds.id as ds_id, ds.name as ds_name,
//                            ds.start_date as start_date_ds, ds.end_date as end_date_ds,
//                            d.id as dealer_id, d.name as dealer_name,
//                            d.start_date as start_date_d, d.end_date as end_date_d
//                       from dealer_sites ds
//                       join dealers d
//                         on d.id = ds.dealer_id
//                      where 1=1) dsv
//                 on dsv.ds_id = vds.dealer_site_id
//              where 1=1) vdrl
//         on vdrl.vds_id = vdbrl.vds_rltn_id
//       join (select bs.id as bs_id, bs.name as bs_name,
//                    bs.start_date as start_date_bs, bs.end_date as end_date_bs,
//                    b.name as buyer_name, b.id as buyer_id,
//                    b.start_date as start_date_buyer, b.end_date as end_date_buyer
//               from buyer_sites bs
//               join buyers b
//                 on b.id = bs.buyer_id
//              where 1=1) bsv
//         on bsv.bs_id = vdbrl.buyer_site_id
//      where 1=1;
//      `,
//     dependsOn: [UserEntityRelationsV, VendorToDealerSiteToBuyerSite],
// })
export default class VendorDealerBuyerRltnsV {
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
