/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
import { Router } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { createReadStream } from "fs";
import httpStatus from "http-status";
import { InsertResult } from "typeorm";
import { checkFileType } from "../../middlewares";
import {
    Invoice,
    InvoiceInterface,
    InvoiceLine,
    PaymentSchedule,
} from "../../models";
import { __prod__ } from "../../scripts/dev";
import CsvParser from "../../scripts/parser/csvParser";
import DataVerifier from "../../scripts/parser/dataVerifier";
import { GenerateCsv } from "../../scripts/parser/generateCsv";
import DatabaseTransaction from "../../scripts/transection/databaseTransection";
import { increment } from "../../scripts/utils/revokeRefreshToken";
import { TypedRequest, TypedResponse } from "../../types";
import { Routes } from "../../types/routePath";
import validateIds from "./checkIds";
import { OmittedInvoice } from "./type";

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
const LINE = "L";
const HEAD = "H";
const RATE_LIMIT = 5;

export type Args<T> = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [P in keyof T as T[P] extends Function ? never : P]: T[P];
};
router.post(
    Routes.PROCESS_INVOICE_UPLOAD,
    fileRoute(),
    checkFileType,
    async (
        req: TypedRequest<any, { hasInstallment: string }>,
        res: TypedResponse
    ) => {
        const file = req.files?.file as UploadedFile;
        const hasInstallment = Boolean(req.query.hasInstallment);
        const stream = createReadStream(file.tempFilePath, {
            encoding: "utf-8",
            highWaterMark: HIGHWATERMARK,
        });

        let data = "";
        stream.on("data", (chunk) => {
            data += chunk;
        });
        stream.on("error", (err) =>
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: err.message,
            })
        );

        const fileName = file.name;
        const { user } = req;

        const fileProcessid = await increment("invoice_file_process_id");

        const parser = new CsvParser<InvoiceInterface>(DELIMITER);

        parser.readData(data);
        // @ts-ignore
        // eslint-disable-next-line consistent-return
        parser.matcher(async (err, parsedData) => {
            if (err || !parsedData) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "bad request",
                });
            }

            const invoiceInsertResp: {
                header: [
                    {
                        [P in keyof Args<OmittedInvoice>]: Args<OmittedInvoice>[P];
                    }
                ];
                line: Array<Args<OmittedInvoice>>;
                // @ts-ignore
            } = { header: [{}], line: [] };

            // const insertQueue: Array<Promise<InvoiceInterface>> = [];
            const insertQueue: Array<Args<InvoiceInterface>> = [];

            for (const record of parsedData) {
                insertQueue.push(
                    InvoiceInterface.create({
                        ...record,
                        file_name: fileName,
                        file_process_id: fileProcessid,
                        created_by: user,
                        updated_by: user,
                    })
                );
            }

            try {
                DatabaseTransaction.connect();
                await DatabaseTransaction.transection(
                    async (error, queryRunner) => {
                        if (error) {
                            // eslint-disable-next-line no-console
                            console.log("err", error);
                            return res
                                .status(httpStatus.INTERNAL_SERVER_ERROR)
                                .json({
                                    message: "an error accured try again later",
                                });
                        }

                        const resp = (await queryRunner?.manager.save(
                            insertQueue
                        )) as Args<InvoiceInterface>[];

                        for (let i = 0; i < resp.length; i++) {
                            const {
                                created_at,
                                created_by,
                                updated_at,
                                updated_by,
                                ...args
                            } = resp[i];
                            if (resp[i].record_type === HEAD)
                                invoiceInsertResp.header[0] = args;
                            else if (resp[i].record_type === LINE)
                                invoiceInsertResp.line.push(args);
                        }

                        const viDataVerifier = new DataVerifier("vi");
                        viDataVerifier.setVIData([
                            ...invoiceInsertResp.header,
                            ...invoiceInsertResp.line,
                        ]);
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

                        // all done here;
                        const csvHeader = viDataVerifier.getVIData[0];
                        const valid = await validateIds([
                            parseInt(csvHeader.vdsbs_id, 10),
                        ]);
                        if (!valid)
                            return res.status(httpStatus.BAD_REQUEST).json({
                                message: "bad request",
                            });

                        const invoiceEntity = Invoice.create({
                            amount: parseFloat(csvHeader.due_amount as string),
                            vdsbsId: +csvHeader.vdsbs_id,
                            currency: csvHeader.currency,
                            dueDate: csvHeader.due_date,
                            end_date: csvHeader.end_date,
                            start_date: csvHeader.start_date,
                            invoiceNo: csvHeader.invoice_no,
                            invoiceDate: csvHeader.invoice_date,
                            refUserList: csvHeader.related_users,
                            created_by: user,
                            updated_by: user,
                        });

                        const response = (await queryRunner?.manager.insert(
                            Invoice,
                            invoiceEntity
                        )) as InsertResult;
                        const invoice = response.raw[0] as Invoice;
                        const queue: Array<Partial<InvoiceLine>> = [];
                        for (
                            let j = 0;
                            j < invoiceInsertResp.line.length;
                            j++
                        ) {
                            queue.push(
                                InvoiceLine.create({
                                    ...invoiceInsertResp.line[j],
                                    created_by: user,
                                    updated_by: user,
                                    lineNo: parseInt(
                                        invoiceInsertResp.line[j]
                                            .line_no as string,
                                        10
                                    ),
                                    amount: parseFloat(
                                        invoiceInsertResp.line[j]
                                            .due_amount as string
                                    ),
                                    itemQuantity: parseInt(
                                        invoiceInsertResp.line[j]
                                            .item_quantity as string,
                                        10
                                    ),
                                })
                            );
                        }

                        await queryRunner?.manager.save(queue, {
                            chunk: RATE_LIMIT,
                        });

                        const { due_date, line_no } =
                            invoiceInsertResp.header[0];
                        if (!hasInstallment) {
                            await queryRunner?.manager.save(
                                PaymentSchedule.create({
                                    ...invoiceInsertResp.header[0],
                                    lineNo: parseInt(line_no as string, 10),
                                    dueDate: due_date
                                        ? new Date(due_date)
                                        : undefined,
                                    invoice,
                                    updated_by: user,
                                    created_by: user,
                                    vdsbsId: +csvHeader.vdsbs_id,
                                })
                            );
                        }

                        return res.status(httpStatus.CREATED).json({
                            message: "operation succesfull",
                        });
                    }
                );

                // return res.status(httpStatus.CREATED).json({
                //     message: "operation succesfull",
                // });
            } catch (err1) {
                // eslint-disable-next-line no-console
                console.log("error", err1);
                if (err1?.detail?.includes("already exists")) {
                    // already exits error;
                    return res.status(httpStatus.BAD_REQUEST).json({
                        message: "this record already exists",
                    });
                }
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    message: "an error accured try again later",
                });
            }
        });
    }
);
export default router;
