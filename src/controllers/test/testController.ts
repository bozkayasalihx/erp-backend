import { Request, Response } from "express";
import { User } from "../../models";
import { UserTypes } from "../../types/types";
import { appDataSource } from "../../loaders";

export default async function testControler(req: Request, res: Response) {
    const user = new User();
    user.username = "salih";
    user.email = "jamesgosling@gmail.com";
    user.mobile = "1231928392183";
    user.tckn = BigInt(28102381203820);
    user.password = "google is best";
    user.user_type = UserTypes.VENDOR_ADMIN;

    const maker = await appDataSource.getRepository(User).save(user);
    console.log("maker", maker);

    return res.send("not found");
}
