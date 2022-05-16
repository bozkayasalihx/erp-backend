import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import httpStatus from "http-status";
import path from "node:path";
import { promisify } from "node:util";

export default async function fileUpload(req: Request, res: Response) {
    // prettier-ignore
    /*eslint no-useless-escape: "warn"*/
    const regex = new RegExp("\.([a-z]{3,})$", 'gi');
    const file = req.files?.file as UploadedFile;
    const results = regex.exec(file.name);

    if (!results)
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "invalid file type",
        });

    const extension = results[1];
    const name = file.name.replace(results[0], "").trim();

    const filename = `${name}-${Date.now()}.${extension}`;

    const fileMv = promisify(file.mv);
    try {
        await fileMv(path.join(__dirname, "../../../src/public", filename));
        return res.status(httpStatus.OK).json({
            message: "file succesfuly uploaded",
        });
    } catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "an error accured",
        });
    }
}
