import { userEntityRelationOperation } from "../../services";
export async function getAllVdsbs(user_id: number, vdsbs_id?: number) {
    const data = await userEntityRelationOperation.repo
        .createQueryBuilder("uer")
        .leftJoin("uer.user", "user")
        .leftJoin("uer.vendor_table_ref", "vendor")
        .leftJoin("uer.buyer_site_table_ref", "bs")
        .leftJoin("uer.dealer_site_table_ref", "ds")
        .where("uer.user_id = :id", { id: user_id })
        .select(["uer", "user", "vendor", "bs", "ds"])
        .execute();

    console.log("data", data);
}
