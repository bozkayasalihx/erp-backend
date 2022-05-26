import { Router } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { createReadStream } from "fs";
import httpStatus from "http-status";
import { checkFileType } from "../../middlewares";
import { __prod__ } from "../../scripts/dev";
import CsvParser from "../../scripts/parser/csv-parser";
import { invoiceOperation } from "../../services";
import { Routes } from "../../types/routePath";

const DELIMITER = ";";
const LIMIT = 20;
const HIGHTWATERMARK = 150 * 1024;

const router = Router();
const file = () => {
    return fileUpload({
        limits: {
            fileSize: 10 * 1024 * 1024, // 10mb
        },
        useTempFiles: true,
        tempFileDir: "/temp/",
        debug: !__prod__,
    });
};

router.post(Routes.PROCESS_UPLOAD, file(), checkFileType, async (req, res) => {
    const file = req.files?.file as UploadedFile;
    const parser = new CsvParser(DELIMITER);
    const stream = createReadStream(file.tempFilePath, {
        encoding: "utf-8",
        highWaterMark: HIGHTWATERMARK,
    });
    try {
        let data = "";
        stream.on("data", (chunk) => {
            data += chunk;
        });
        const filename = file.name;
        const user = req.user;

        stream.on("end", () => {
            parser.readData(data);
            parser.matcher((data) => {
                data.forEach(async (item) => {
                    await invoiceOperation.createInvoiceInterface({
                        ...item,
                        file_name: filename,
                        file_process_id: 1,
                        created_by: user,
                        updated_by: user,
                    });
                });
            });
        });

        return res
            .status(httpStatus.OK)
            .json({ message: "operation succesfull" });
    } catch (err) {
        if (err?.detail?.includes("already exists")) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "already exists",
            });
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
});

export default router;
