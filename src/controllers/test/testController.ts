import { Request, Response } from "express";
import { appDataSource } from "../../loaders";
import { BuyerSite, User, Vendor } from "../../models";
import UserEntityRelation from "../../models/UserEntityRelation";

export default async function testControler(req: Request, res: Response) {
    // const userRelation = new UserEntityRelation();
    // const user = (await appDataSource.manager.findOne(User, {
    //     where: { username: "salih" },
    // })) as User;
    // userRelation.description = "salih is the best";
    // userRelation.user_id = user.id;
    // userRelation.created_by = user.id;
    // userRelation.updated_by = user.id;

    // const maker = await appDataSource.manager.save(userRelation);
    // console.log("maker", maker);

    // const user = new User();
    // user.username = "salih";
    // user.email = "test@test.com";
    // user.mobile = "123812937";
    // user.password = "james is best";
    // user.tckn = BigInt("2312391237");
    // user.user_type = UserTypes.DEALER;

    // const maker = await appDataSource.manager.save(user);

    // const user = (await appDataSource.manager.findOne(User, {
    //     where: { username: "salih" },
    // })) as User;

    // const vendor = (await appDataSource.manager.findOne(Vendor, {
    //     where: { name: "tuborg" },
    // })) as Vendor;

    // const usrRelation = new UserEntityRelation();
    // usrRelation.description = "james is the best of the me ";
    // usrRelation.created_by = user.id;
    // usrRelation.updated_by = user.id;
    // usrRelation.user_id = user.id;

    // const maker = await appDataSource.manager.save(usrRelation);
    // console.log("maker", maker);

    // const vendor = new Vendor()
    // vendor.name = "tuborg";
    // vendor.tax_no = "maker";

    const user = (await appDataSource.manager.findOne(User, {
        where: { username: "james" },
    })) as User;
    console.log("user", user);
    const vendor = (await appDataSource.manager.findOne(Vendor, {
        where: { name: "vendor" },
    })) as Vendor;
    const buyerSite = (await appDataSource.manager.findOne(BuyerSite, {
        where: { name: "buyer site" },
    })) as BuyerSite;

    const ue = new UserEntityRelation();
    ue.created_by = user;
    ue.updated_by = user;
    ue.buyer_site_ref_table = buyerSite;
    ue.description = "vendor";
    ue.user = user;

    const v = new Vendor();

    // await ue.save();
    const maker = await UserEntityRelation.findOne({
        where: { user: { id: user.id } },
        relations: {
            dealer_site_ref_table: true,
            vendor_ref_table: true,
            buyer_site_ref_table: true,
        },
    });

    return res.send({
        message: "done with that",
    });
}
