import { Request, Response } from "express";
import { appDataSource } from "../../loaders";
import { User, Vendor } from "../../models";
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

    const user = (await appDataSource.manager.findOne(User, {
        where: { username: "salih" },
    })) as User;

    const vendor = (await appDataSource.manager.findOne(Vendor, {
        where: { name: "tuborg" },
    })) as Vendor;

    const usrRelation = new UserEntityRelation();
    usrRelation.description = "james is the best of the me ";
    usrRelation.created_by = user.id;
    usrRelation.updated_by = user.id;
    usrRelation.user_id = user.id;
    usrRelation.ref_entity_id = user.id;

    const maker = await appDataSource.manager.save(usrRelation);
    console.log("maker", maker);

    return res.send("not found");
}
