import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { appDataSource } from "../loaders";
import { UserTypes } from "../types/types";
import { IBody } from "../middlewares/isLoggedIn";
import {
    Dealer,
    DealerSite,
    User,
    Vendor,
    VendorToDealerSiteToBuyerSite,
} from "../models";

async function loginController(req: Request<any, any, IBody>, res: Response) {
    // const user = new User();
    // user.username = "salih";
    // user.email = "salih@maker.com";
    // user.mobile = "5385882737";
    // user.password = await bcrypt.hash("salih", 10);
    // user.tckn = BigInt(11090259670);
    // user.user_type = UserTypes.VENDOR_ADMIN;

    let maker;
    const user = (await appDataSource.manager.findOne(User, {
        where: { username: "salih" },
    })) as User;

    // const vendor = new Vendor();
    // vendor.name = "coca cola";
    // vendor.tax_no = "12412323";
    // vendor.created_by = user.id;
    // vendor.updated_by = user.id;

    // const dealer = new Dealer();
    // dealer.name = "alt coca cola";
    // dealer.tax_no = "43534954375";
    // dealer.updated_by = user.id;
    // dealer.created_by = user.id;

    const dealerRepo = appDataSource.getRepository(Dealer);
    maker = await dealerRepo.findOne({
        where: { name: "alt coca cola" },
    });

    // const dealerSite = new DealerSite();
    // dealerSite.name = "alt alt coca cola";
    // dealerSite.dealer_id = 1;
    // dealerSite.created_by = user.id;
    // dealerSite.updated_by = user.id;

    // maker = await appDataSource.manager.save(dealerSite);

    console.log("maker", maker);

    // const buyer = new Buyer();
    // buyer.name = "ust bakkal";
    // buyer.tax_no = "2934729347";

    // const buyerSite = new BuyerSite();
    // buyerSite.name = "alt bakkal";

    // buyer.buyer_sites = [buyerSite];
    // buyerSite.buyer = buyer;

    // const vds = new VendorToDealerSite();
    // vds.description = "salih is the best";

    // vds.vendor = vendor;
    // vds.dealerSite = dealerSite;
    // dealerSite.vendorToDealerSites = [vds];
    // vendor.vendorToDealerSite = [vds];

    // const vtdsbs = new VendorToDealerSiteToBuyerSite()

    // vds.vToDsBs = vtdsbs;
    // vtdsbs.buyerSites = [buyerSite];
    // vtdsbs.vToDS = [vds];

    // const email = req.body.email;

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
