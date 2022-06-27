/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { createReadStream } from "fs";
import httpStatus from "http-status";
import { InsertResult } from "typeorm";
import { checkFileType } from "../../middlewares";
import { PaymentScheduleInterface } from "../../models";
import { __prod__ } from "../../scripts/dev";
import parseError from "../../scripts/errors/parseError";
import CsvParser from "../../scripts/parser/csvParser";
import DataVerifier from "../../scripts/parser/dataVerifier";
import { GenerateCsv } from "../../scripts/parser/generateCsv";
import { increment } from "../../scripts/utils/revokeRefreshToken";
import { invoiceOperation, paymentOperation } from "../../services";
import { TypedResponse } from "../../types";
import { Routes } from "../../types/routePath";
import { OmmitedPaymentSchedule } from "./type";
import { Args } from "./VIUploadProcess";

const router = Router();
const fileRoute = () =>
    fileUpload({
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        useTempFiles: true,
        tempFileDir: "~/temp/",
        debug: !__prod__,
    });

const DELIMITER = ";";
const HIGHWATERMARK = 150 * 1024;

router.post(
    Routes.PROCESS_PS_UPLOAD,
    fileRoute(),
    checkFileType,
    async (req, res: TypedResponse) => {
        const file = req.files?.file as UploadedFile;
        const stream = createReadStream(file.tempFilePath, {
            encoding: "utf-8",
            highWaterMark: HIGHWATERMARK,
        });
        let data = "";
        stream.on("data", (chunk) => {
            data += chunk;
        });
        stream.on("error", () =>
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: "an error accured try again later",
            })
        );

        const fileName = file.name;
        const { user } = req;

        const fileProcessid = await increment("ps_file_process_id");

        const parser = new CsvParser<PaymentScheduleInterface>(DELIMITER);

        parser.readData(data);
        parser.matcher(async (err, parsedData) => {
            if (err || !parsedData) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "bad request",
                });
            }

            const insertedPSIResp: Array<Args<OmmitedPaymentSchedule>> = [];
            const insertQueue: Array<Promise<PaymentScheduleInterface>> = [];
            for (const record of parsedData) {
                insertQueue.push(
                    paymentOperation.PSIRepo.save(
                        {
                            ...record,
                            file_name: fileName,
                            file_process_id: fileProcessid,
                            created_by: user,
                            updated_by: user,
                        },
                        { chunk: 5 }
                    )
                );
            }

            try {
                const temp = await Promise.all(insertQueue);

                for (let i = 0; i < temp.length; i++) {
                    const {
                        created_by,
                        updated_by,
                        created_at,
                        updated_at,
                        ...args
                    } = temp[i];
                    insertedPSIResp.push(args);
                }
            } catch (err1) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    message: "an error accured try again later",
                });
            }

            const psiDataVerifier = new DataVerifier("psi");

            psiDataVerifier.setPSIData(insertedPSIResp);
            psiDataVerifier.validate();

            if (psiDataVerifier.errors.size) {
                const generateCsv = new GenerateCsv<PaymentScheduleInterface>(
                    psiDataVerifier.errors,
                    parsedData
                );
                await generateCsv.genereate(fileName);

                return res.status(httpStatus.BAD_REQUEST).json({
                    message:
                        "invalid column type detected please fix that type and try again",
                });
            }

            const psi = psiDataVerifier.getPSIData[0];

            const vdsbsId = parseInt(psi.vdsbs_id as string, 10);
            const invoiceNo = psi.invoice_no as string;

            const invoice = await invoiceOperation.invoiceRepo.findOne({
                where: { vdsbsId, invoiceNo },
            });
            if (!invoice) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "bad request",
                });
            }

            const queue: Array<Promise<InsertResult>> = [];
            for (let i = 0; i < psiDataVerifier.getPSIData.length; i++) {
                const currentPSI = psiDataVerifier.getPSIData[i];
                queue.push(
                    paymentOperation.psRepo.insert({
                        currency: currentPSI.currency as string,
                        invoice,
                        vdsbsId,
                        dueDate: new Date(currentPSI.due_date as string),
                        dueAmount: parseFloat(currentPSI.due_amount as string),
                        lineNo: parseInt(currentPSI.line_no as string, 10),
                        created_by: user,
                        updated_by: user,
                    })
                );
            }

            try {
                await Promise.all(queue);

                return res.status(httpStatus.OK).json({
                    message: "operation succesful",
                });
            } catch (erro1) {
                parseError.setError(erro1?.detail);
                const d = parseError.parser();
                if (!d) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        message: "an error accured try again later",
                    });
                }

                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "some of yours inputs is invalid",
                    data: { message: erro1?.detail },
                });
            }
        });
    }
);

export default router;
