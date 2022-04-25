import { Request, Response } from "express";

export interface VendorBody {
    name: string;
    tax_no: number;
    vendor_region_id: number;
}

export default function createVendor(
    req: Request<any, any, VendorBody>,
    res: Response
) {
    //vendorOperation.vendorRepo.
    const body = req.body;

    console.log("body", body);
}
