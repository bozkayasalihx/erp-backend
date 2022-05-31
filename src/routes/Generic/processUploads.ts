import { Router } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { createReadStream } from "fs";
import httpStatus from "http-status";
import { customEventEmitter } from "../../loaders";
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
const HIGHWATERMARK = 150 * 1024;

router.post(
    Routes.PROCESS_INVOICE_UPLOAD,
    file(),
    checkFileType,
    async (req, res) => {
        const file = req.files?.file as UploadedFile;
        const parser = new CsvParser(DELIMITER);
        const stream = createReadStream(file.tempFilePath, {
            encoding: "utf-8",
            highWaterMark: HIGHWATERMARK,
        });
        try {
            let data = "";
            stream.on("data", (chunk) => {
                data += chunk;
            });
            const filename = file.name;
            const user = req.user;
            try {
                stream.on("end", async () => {
                    const file_process_id = await increment(
                        "invoice_file_process_id"
                    );
                    parser.readData(data);
                    //@ts-ignore
                    parser.matcher(async (err, data) => {
                        if (err || !data) {
                            // res.status(httpStatus.BAD_REQUEST).json({
                            //     message: err?.message,
                            // });
                            return;
                        }
                        for (const item of data) {
                            const firstValue = Object.values(item)[0];
                            await invoiceOperation.createInvoiceInterface({
                                ...item,
                                file_name: filename,
                                file_process_id,
                                created_by: user,
                                updated_by: user,
                                record_type: firstValue,
                            });
                        }

                        customEventEmitter.emit(
                            "process_invoiceInterface",
                            {
                                file_process_id,
                                user,
                            },
                            file.tempFilePath
                        );

                        // return res.status(httpStatus.CREATED).json({
                        //     message: "operation succesful",
                        // });
                    });
                });

                stream.on("error", (error) => {
                    console.log("____err_____", error);
                    return res.status(httpStatus.BAD_REQUEST).json({
                        message: "bad request",
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
            highWaterMark: HIGHWATERMARK,
        });
        try {
            let data = "";
            stream.on("data", (chunk) => {
                data += chunk;
            });
            const filename = file.name;
            const user = req.user;

            try {
                stream.on("end", async () => {
                    const file_process_id = await increment(
                        "ps_file_process_id"
                    );
                    parser.readData(data);
                    parser.matcher(async (err, data) => {
                        if (err || !data) {
                            return res.status(httpStatus.BAD_REQUEST).json({
                                message: err?.message,
                            });
                        }
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

                        return res.status(httpStatus.CREATED).json({
                            message: "operation succesful",
                        });
                    });

                    customEventEmitter.emit(
                        "process_psi",
                        {
                            file_process_id,
                            user,
                        },
                        file.tempFilePath
                    );
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
