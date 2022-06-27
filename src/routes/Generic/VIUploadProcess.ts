/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
import { Router } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { createReadStream } from "fs";
import httpStatus from "http-status";
import { InsertResult } from "typeorm";
import { checkFileType } from "../../middlewares";
import { Invoice, InvoiceInterface } from "../../models";
import { __prod__ } from "../../scripts/dev";
import CsvParser from "../../scripts/parser/csvParser";
import DataVerifier from "../../scripts/parser/dataVerifier";
import { GenerateCsv } from "../../scripts/parser/generateCsv";
import { increment } from "../../scripts/utils/revokeRefreshToken";
import { invoiceOperation, paymentOperation } from "../../services";
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

            const insertQueue: Array<Promise<InvoiceInterface>> = [];

            for (const record of parsedData) {
                insertQueue.push(
                    invoiceOperation.invoiceInterfaceRepo.save(
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
                const resp = await Promise.all(insertQueue);
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
            } catch (err1) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    message: "an error accured try again later",
                });
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
            const valid = await validateIds([parseInt(csvHeader.vdsbs_id, 10)]);
            if (!valid)
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "bad request",
                });

            try {
                const resp = await invoiceOperation.invoiceRepo.insert({
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

                const invoice = resp.raw[0] as Invoice;
                const queue: Array<Promise<InsertResult>> = [];
                for (let j = 0; j < invoiceInsertResp.line.length; j++) {
                    queue.push(
                        invoiceOperation.createInvoiceLine({
                            ...invoiceInsertResp.line[j],
                            created_by: user,
                            updated_by: user,
                            lineNo: parseInt(
                                invoiceInsertResp.line[j].line_no as string,
                                10
                            ),
                            amount: parseFloat(
                                invoiceInsertResp.line[j].due_amount as string
                            ),
                            itemQuantity: parseInt(
                                invoiceInsertResp.line[j]
                                    .item_quantity as string,
                                10
                            ),
                        })
                    );
                }

                await Promise.all(queue);

                const { due_date, line_no } = invoiceInsertResp.header[0];
                if (!hasInstallment) {
                    await paymentOperation.createPS({
                        ...invoiceInsertResp.header[0],
                        lineNo: parseInt(line_no as string, 10),
                        dueDate: due_date ? new Date(due_date) : undefined,
                        invoice,
                        updated_by: user,
                        created_by: user,
                        vdsbsId: +csvHeader.vdsbs_id,
                    });
                }

                return res.status(httpStatus.CREATED).json({
                    message: "operation succesfull",
                });
            } catch (err1) {
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
