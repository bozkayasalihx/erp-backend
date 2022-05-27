import { Router } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { createReadStream } from "fs";
import httpStatus from "http-status";
import { checkFileType } from "../../middlewares";
import { __prod__ } from "../../scripts/dev";
import CsvParser from "../../scripts/parser/csv-parser";
import { increment } from "../../scripts/utils/revokeRefreshToken";
import { invoiceOperation, paymentOperation } from "../../services";
import { Routes } from "../../types/routePath";

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

const DELIMITER = ";";
const LIMIT = 20;
const HIGHTWATERMARK = 150 * 1024;

router.post(
    Routes.PROCESS_INVOICE_UPLOAD,
    file(),
    checkFileType,
    async (req, res) => {
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
            let file_process_id = 1;
            process.nextTick(async () => {
                file_process_id = await increment("ps_file_process_id");
            });

            try {
                stream.on("end", () => {
                    parser.readData(data);
                    parser.matcher(async (data) => {
                        for (const item of data) {
                            const firstValue = Object.values(item)[0];
                            await invoiceOperation.createInvoiceInterface({
                                ...item,
                                file_name: filename,
                                file_process_id: file_process_id,
                                created_by: user,
                                updated_by: user,
                                record_type: firstValue,
                            });
                        }
                    });
                });

                return res.status(httpStatus.CREATED).json({
                    message: "operation succesful",
                });
            } catch (err) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "an error accured try again later",
                });
            }
        } catch (err) {
            if (err?.detail?.includes("already exists")) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "already exists",
                });
            }
            return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
        }
    }
);

router.post(
    Routes.PROCESS_PS_UPLOAD,
    file(),
    checkFileType,
    async (req, res) => {
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
            let file_process_id = 1;
            process.nextTick(async () => {
                file_process_id = await increment("invoice_file_process_id");
            });

            try {
                stream.on("end", () => {
                    parser.readData(data);
                    parser.matcher(async (data) => {
                        for (const item of data) {
                            const firstValue = Object.values(item)[0];
                            await paymentOperation.createPSI({
                                ...item,
                                file_name: filename,
                                file_process_id,
                                created_by: user,
                                updated_by: user,
                                invoice_no: firstValue,
                            });
                        }
                    });
                });

                return res.status(httpStatus.CREATED).json({
                    message: "operation succesful",
                });
            } catch (err) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "an error accured try again later",
                });
            }
        } catch (err) {
            if (err?.detail?.includes("already exists")) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "already exists",
                });
            }
            return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
        }
    }
);

export default router;
