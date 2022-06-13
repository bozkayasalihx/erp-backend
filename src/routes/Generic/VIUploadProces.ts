import { Router } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { createReadStream } from "fs";
import httpStatus from "http-status";
import { checkFileType } from "../../middlewares";
import { __prod__ } from "../../scripts/dev";
import parseError from "../../scripts/errors/parseError";
import CsvParser from "../../scripts/parser/csvParser";
import DataVerifier from "../../scripts/parser/dataVerifier";
import { GenerateCsv } from "../../scripts/parser/generateCsv";
import { increment } from "../../scripts/utils/revokeRefreshToken";
import { invoiceOperation } from "../../services";
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
        const stream = createReadStream(file.tempFilePath, {
            encoding: "utf-8",
            highWaterMark: HIGHWATERMARK,
        });

        let data = "";
        stream.on("data", (chunk) => {
            data += chunk;
        });
        stream.on("error", (err) => {
            console.log("err", err.message);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: "an error accured try again later",
            });
        });

        const fileName = file.name;
        const user = req.user;

        const fileProcessid = await increment("invoice_file_process_id");
        const parser = new CsvParser(DELIMITER);

        parser.readData(data);
        parser.matcher(async (err, parsedData) => {
            if (err || !parsedData)
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "bad request",
                });

            const results: Record<string, any>[] = [];
            for (const record of parsedData) {
                const recordTypeValue = Object.values(record)[0];
                try {
                    const {
                        created_by,
                        updated_by,
                        created_at,
                        updated_at,
                        ...args
                    } = await invoiceOperation.invoiceInterfaceRepo.save(
                        {
                            ...record,
                            file_name: fileName,
                            file_process_id: fileProcessid,
                            record_type: recordTypeValue,
                            created_by: user,
                            updated_by: user,
                        },
                        { chunk: 5 }
                    );

                    results.push(args);
                } catch (err) {
                    console.log("err", err);
                }
            }

            const viDataVerifier = new DataVerifier("vi");
            viDataVerifier.setVIData(results);
            viDataVerifier.validate();

            if (viDataVerifier.errors.size) {
                const generateCsv = new GenerateCsv(
                    viDataVerifier.errors,
                    parsedData
                );
                await generateCsv.genereate(fileName);

                return res.status(httpStatus.BAD_REQUEST).json({
                    message:
                        "invalid column type detected please fix that type and try again",
                });
            }

            for (let i = 0; i < viDataVerifier.getVIData.length; i++) {
                const currentVI = viDataVerifier.getVIData[i];
                try {
                    await invoiceOperation.invoiceRepo.insert({
                        amount: parseFloat(currentVI.amount as string),
                        currency: currentVI.currency,
                        due_date: currentVI.due_date,
                        end_date: currentVI.end_date,
                        start_date: currentVI.start_date,
                        invoice_no: currentVI.invoice_no,
                        invoice_date: currentVI.invoice_date,
                        ref_user_list: currentVI.related_users,
                    });
                } catch (err) {
                    parseError.setError(err?.detail);
                    const data = parseError.parser();
                    if (!data)
                        return res
                            .status(httpStatus.INTERNAL_SERVER_ERROR)
                            .json({
                                message: "an error accured try again later",
                            });

                    const [key, value] = data;
                    return res.status(httpStatus.BAD_REQUEST).json({
                        message: "some of yours inputs is invalid",
                        data: { message: err?.detail },
                    });
                }
            }

            return res.status(httpStatus.CREATED).json({
                message: "operation successful",
            });
        });
    }
);
export default router;
