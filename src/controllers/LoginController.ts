import { Request, Response } from "express";
import httpStatus from "http-status";
import { IBody } from "../middlewares/isLoggedIn";
import { Buyer, BuyerSite, Dealer, DealerSite, User, Vendor } from "../models";
import { __prod__ } from "../scripts/dev";
import generateToken from "../scripts/utils/generateToken";
import bcrypt from "bcryptjs";
import { UsingJoinTableOnlyOnOneSideAllowedError } from "typeorm";
import { appDataSource } from "../loaders";

async function loginController(req: Request<any, any, IBody>, res: Response) {
    const email = req.body.email;

    // const user = new User();
    // user.username = "salih";
    // user.email = "test@test.com";
    // user.password = await bcrypt.hash("salih", 10);
    // user.mobile = "123123123123123";
    // user.tckn = BigInt(11090259670);

    // const maker = await appDataSource.getRepository(User).save();

    // console.log("maker", maker);
    const userRepo = appDataSource.getRepository(User);
    const vendorRepo = appDataSource.getRepository(Vendor);
    const buyerRepo = appDataSource.getRepository(Buyer);
    const buyerSiteRepo = appDataSource.getRepository(BuyerSite);
    const dealerRepo = appDataSource.getRepository(Dealer);
    const dealerSiteRepo = appDataSource.getRepository(DealerSite);

    const vendor = new Vendor();
    const user = await userRepo.findOne({ where: { username: "salih" } });
    vendor.name = "tuborg";
    vendor.tax_no = "23413123";

    vendor.created_by = user?.id as number;
    vendor.updated_by = user?.id as number;
    vendor.user_id = user?.id as number;
    // await appDataSource.getRepository(Vendor).save(vendor);
    let maker;
    // const dealer = new Dealer();
    // dealer.name = "ALT tuborg";
    // dealer.tax_no = "1231232";
    // dealer.created_by = user?.id as number;
    // dealer.updated_by = user?.id as number;

    // maker = await dealerRepo.save(dealer);
    const dealer = await dealerRepo.findOne({ where: { name: "ALT tuborg" } });
    const dealerSite = new DealerSite();
    dealerSite.name = "ALT ALT tuborg";
    dealerSite.created_by = user?.id as number;
    dealerSite.updated_by = user?.id as number;
    dealerSite.dealer = dealer as Dealer; dealerSite.dealer_id = dealer?.id as number;
    maker = await dealerSiteRepo.save(dealerSite);

    console.log("maker", maker);

    // const dealer = new Dealer();
    // dealer.name = "ulker";
    // dealer.tax_no = "34593745";

    // const dealerSite1 = new DealerSite();
    // dealerSite1.name = "alt ulker";
    // dealer.dealer_site = [dealerSite1];

    // const buyer = new Buyer();

    // buyer.name = "bakkal";
    // buyer.tax_no = "2938472347";

    // const buyerSite1 = new BuyerSite();
    // buyerSite1.name = "alt bakkal";

    // const vendorToDealerSite1 = new VendorToDealerSite();
    // vendorToDealerSite1.dealerSite = dealerSite1;
    // buyer.buyer_site = [buyerSite1];

    // const vendorToDealerSiteToBuyerSite1 = new VendorToDealerSiteToBuyerSite();

    // vendorToDealerSiteToBuyerSite1.vendorToDealerSite = [vendorToDealerSite1];

    // vendor.vendorToDealerSite = [vendorToDealerSite1];

    // const maker = await appDataSource
    //     .getRepository(VendorToDealerSiteToBuyerSite)
    //     .save(vendorToDealerSiteToBuyerSite1);

    // console.log("maker", maker);

    return;

    // try {
    //     const findedUser = await user.login(email);

    //     if (!findedUser) {
    //         return res.status(httpStatus.NOT_FOUND).json({
    //             message: "user does not exist",
    //         });
    //     }
    //     const accesTokenExpire = `${process.env.ACCESS_TOKEN_EXPIRE}`;
    //     const refreshTokenExpire = `${process.env.REFRESH_TOKEN_EXPIRE}`;
    //     const access_token = generateToken(
    //         { name: findedUser.username, email: findedUser.email },
    //         process.env.ACCESS_TOKEN_SECRET_KEY as string,
    //         accesTokenExpire
    //     );

    //     const refresh_token = generateToken(
    //         { name: findedUser.username, email: findedUser.email },
    //         process.env.REFRESH_TOKEN_SECRET_KEY as string,
    //         refreshTokenExpire
    //     );

    //     res.cookie("qid", refresh_token, {
    //         httpOnly: true,
    //         sameSite: "lax",
    //         secure: __prod__,
    //         maxAge: 24 * 60 * 60 * 1000,
    //     });
    //     return res.status(httpStatus.OK).json({
    //         username: findedUser.username,
    //         email: findedUser.email,
    //         access_token,
    //     });
    // } catch (err) {
    //     return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    // }
}

export default loginController;
function errorSlugify(details: import("joi").ValidationErrorItem[]) {
    throw new Error("Function not implemented.");
}
