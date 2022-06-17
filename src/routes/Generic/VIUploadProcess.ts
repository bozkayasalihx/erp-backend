import { Router } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { createReadStream } from "fs";
import httpStatus from "http-status";
import { checkFileType } from "../../middlewares";
import { Invoice, InvoiceInterface } from "../../models";
import { __prod__ } from "../../scripts/dev";
import CsvParser from "../../scripts/parser/csvParser";
import DataVerifier from "../../scripts/parser/dataVerifier";
import { GenerateCsv } from "../../scripts/parser/generateCsv";
import { increment } from "../../scripts/utils/revokeRefreshToken";
import {
    invoiceOperation,
    paymentOperation,
    vendorToDealerSiteToBuyerSiteOperation,
} from "../../services";
import { Routes } from "../../types/routePath";
import { TypedRequest, TypedResponse } from "../../types/types";

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
const LINE = "L";
const HEAD = "H";

export type Args<T> = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [P in keyof T as T[P] extends Function ? never : P]: T[P];
};
type OmittedInvoice = Omit<
    InvoiceInterface,
    "updated_at" | "created_at" | "updated_by" | "created_by"
>;

router.post(
    Routes.PROCESS_INVOICE_UPLOAD,
    file(),
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
        stream.on("error", (err) => {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: err.message,
            });
        });

        const fileName = file.name;
        const user = req.user;

        const fileProcessid = await increment("invoice_file_process_id");

        const parser = new CsvParser<InvoiceInterface>(DELIMITER);

        parser.readData(data);
        parser.matcher(async (err, parsedData) => {
            if (err || !parsedData)
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: "bad request",
                });

            const invoiceInsertResp: {
                header: [
                    {
                        [P in keyof Args<OmittedInvoice>]?: Args<OmittedInvoice>[P];
                    }
                ];
                line: Array<Args<OmittedInvoice>>;
            } = { header: [{}], line: [] };
            for (const record of parsedData) {
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
                            created_by: user,
                            updated_by: user,
                        },
                        { chunk: 5 }
                    );

                    if (record["record_type"] == HEAD)
                        invoiceInsertResp.header.push(args);
                    else if (record["record_type"] == LINE)
                        invoiceInsertResp.line.push(args);
                } catch (err) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                        message: "an error accured try again later",
                    });
                }
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

            for (let i = 0; i < viDataVerifier.getVIData.length; i++) {
                const currentVI = viDataVerifier.getVIData[i];
                const currentVdsbsId = parseInt(currentVI.vdsbs_id as string);

                const currentVdsbs =
                    await vendorToDealerSiteToBuyerSiteOperation.repo.findOne({
                        where: { id: currentVdsbsId },
                    });

                if (!currentVdsbs)
                    return res.status(httpStatus.BAD_REQUEST).json({
                        message: "bad request",
                    });

                try {
                    const resp = await invoiceOperation.invoiceRepo.insert({
                        amount: parseFloat(currentVI.amount as string),
                        vdsbs: currentVdsbs,
                        currency: currentVI.currency,
                        due_date: currentVI.due_date,
                        end_date: currentVI.end_date,
                        start_date: currentVI.start_date,
                        invoice_no: currentVI.invoice_no,
                        invoice_date: currentVI.invoice_date,
                        ref_user_list: currentVI.related_users,
                        created_by: user,
                        updated_by: user,
                    });

                    const invoice = resp.raw[0] as Invoice;

                    for (let j = 0; j < invoiceInsertResp.line.length; j++) {
                        try {
                            await invoiceOperation.createInvoiceLine({
                                ...invoiceInsertResp.line[j],
                                created_by: user,
                                updated_by: user,
                                line_no: +invoiceInsertResp.line[j].line_no,
                                amount: parseFloat(
                                    invoiceInsertResp.line[j].amount as string
                                ),
                                item_quantity: parseInt(
                                    invoiceInsertResp.line[j].item_quantity
                                ),
                            });
                        } catch (err) {
                            return res
                                .status(httpStatus.INTERNAL_SERVER_ERROR)
                                .json({
                                    message: "an error accured try again later",
                                });
                        }
                    }

                    if (!hasInstallment)
                        return await paymentOperation.createPS({
                            ...invoiceInsertResp.header[0],
                            line_no: +invoiceInsertResp.header[0].line_no!,
                            due_date: new Date(
                                invoiceInsertResp.header[0].due_date!
                            ),
                            invoice,
                            vdsbs: currentVdsbs,
                            updated_by: user,
                            created_by: user,
                        });

                    const validInvoice = await invoiceOperation.hasInvoice({
                        invoice_no: invoiceInsertResp.header[0].invoice_no!,
                        vdsbs_id: +invoiceInsertResp.header[0].vdsbs_id!,
                    });

                    if (!validInvoice)
                        return res.status(httpStatus.NOT_FOUND).json({
                            message: "invoice not found",
                        });
                    const invoiceId = validInvoice;
                } catch (err) {
                    if (err?.detail?.includes("already exists")) {
                        // already exits error;
                        return res.status(httpStatus.BAD_REQUEST).json({
                            message: "this record already exists",
                        });
                    }
                    return res.status(httpStatus.BAD_REQUEST).json({
                        message:
                            "some of your inputs are invalid, you may want to check over",
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
