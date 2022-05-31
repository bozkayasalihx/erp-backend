import dayjs from "dayjs";
import Joi, { ValidationErrorItem } from "joi";
import { FindOptionsWhere } from "typeorm";
import { IInvoice } from "../../controllers/invoice/createInvoice";
import { IPaymentSchedule } from "../../controllers/payment/createPayment";
import { InvoiceInterface, PaymentScheduleInterface } from "../../models";
import { invoiceOperation, paymentOperation } from "../../services";
import {
    Currency,
    FileRecordType,
    FileStatusType,
    HAS_PS,
    InvoiceStatusType,
    LineStatusType,
    PaymentType,
} from "../../types/types";

type Tabletype = "psi" | "vi";

type DataType = PaymentScheduleInterface | InvoiceInterface;

enum ErrorSecondName {
    PAYMENT = "payment_schedule_interface",
    INVOICE = "invoice_interface",
}

// cur.amount = parseInt(cur.amount);
// cur.currency = Currency[cur.currency];
// //@ts-ignore
// cur.due_date = this.dateFormater(cur.due_date).format(
//     "DD/MM/YYYY"
// );
// //@ts-ignore
// cur.invoice_date = this.dateFormater(
//     cur.invoice_date
// ).format("DD/MM/YYYY");
// //@ts-ignore
// cur.vdsbs_id = parseInt(cur.vdsbs_id);

interface NewType {
    amount: string | number;
    vdsbs_id: number | string;
    invoice_date: Date | string;
    currency: Currency | string;
    file_status: string | FileStatusType;
    line_status: string | LineStatusType;
    file_process_id: string | number;
    record_type: string | FileRecordType;
    has_ps: string | HAS_PS;
    due_date: string | Date | null;
    related_user?: number[] | string;
}

class DataVerifier {
    private type: Tabletype;
    private data: Array<DataType> = [];
    private paymentOP = paymentOperation;
    private invoiceOP = invoiceOperation;
    private Joi = Joi;
    private errorObj: Map<string, any> = new Map();
    private dateFormater = dayjs;

    constructor(type: Tabletype) {
        this.type = type;
    }

    public get errors() {
        return this.errorObj;
    }

    public get getData() {
        return this.data;
    }

    public async setter(whereClause: FindOptionsWhere<DataType>) {
        if (this.type == "vi") {
            try {
                const resl = await this.invoiceOP.invoiceInterface.findOne({
                    where: [
                        {
                            ...(whereClause as FindOptionsWhere<InvoiceInterface>),
                        },
                        {
                            record_type: FileRecordType.HEADER,
                        },
                    ],
                });

                if (resl) this.data[0] = resl;
            } catch (err) {
                this.errorObj.set(err?.message || ErrorSecondName.INVOICE, err);
            }
        } else if (this.type === "psi") {
            try {
                const resl = await this.paymentOP.PSIRepo.find({
                    where: {
                        ...(whereClause as FindOptionsWhere<PaymentScheduleInterface>),
                    },
                });
                this.data = resl;
            } catch (err) {
                this.errorObj.set(err?.message || ErrorSecondName.PAYMENT, err);
            }
        } else throw new Error("enter valid table name");
    }

    private errorSlugify(error: Array<ValidationErrorItem>) {
        return error
            .map((detail) => {
                return detail.message;
            })
            .join(", ");
    }

    private erorrKeyGen(err: string) {
        const res = /"([^"]*)"/gi.exec(err);
        if (res) return res[1];
        return null;
    }

    private invoiceIntefaceValidationSchema() {
        return this.Joi.object<IInvoice>({
            currency: this.Joi.object({
                currency: this.Joi.valid(...Object.values(Currency)).required(),
            }),
            invoice_no: this.Joi.object({
                invoice_no: this.Joi.string().required().max(30).required(),
            }),
            invoice_date: this.Joi.object({
                invoice_date: this.Joi.date().required(),
            }),
            amount: this.Joi.object({ amount: this.Joi.number().required() }),
            status: this.Joi.object({
                status: this.Joi.valid(
                    ...Object.values(InvoiceStatusType)
                ).required(),
            }),
            ref_file_id: this.Joi.object({
                ref_file_id: this.Joi.number().required(),
            }),
            due_date: this.Joi.object({ due_date: this.Joi.date().required() }),
            vdsbs_id: this.Joi.object({
                vdsbs_id: this.Joi.number().required(),
            }),
        });
    }

    private PSIValidatonSchema() {
        return this.Joi.object<IPaymentSchedule>({
            currency: Joi.object({
                currency: this.Joi.valid(...Object.values(Currency)).optional(),
            }),
            remained_amount: Joi.object({
                remained_amount: this.Joi.number().required(),
            }),
            effective_date: Joi.object({
                effective_date: this.Joi.date().required(),
            }),
            invoiced_status: Joi.object({
                invoiced_status: this.Joi.valid(
                    ...Object.values(InvoiceStatusType)
                ).optional(),
            }),
            original_amount: Joi.object({
                original_amount: this.Joi.number().required(),
            }),
            payment_type: Joi.object({
                payment_type: this.Joi.valid(
                    ...Object.values(PaymentType)
                ).optional(),
            }),
            reference_id: this.Joi.object({
                reference_id: this.Joi.number().required(),
            }),

            vdsbs_id: this.Joi.object({
                vdsbs_id: this.Joi.number().required(),
            }),
        });
    }

    private transform(data: Array<DataType>) {
        const newDate: Array<DataType> = [];
        for (let i = 0; i < data.length; i++) {
            if (this.type === "vi") {
                const cur = data[i] as NewType;
                try {
                    cur.amount = parseInt(cur.amount as string) as number;
                    // cur.currency = Currency[cur.currency] as Currency;
                    cur.due_date = this.dateFormater(cur.due_date).format(
                        "DD/MM/YYYY"
                    );
                    cur.invoice_date = this.dateFormater(
                        cur.invoice_date
                    ).format("DD/MM/YYYY");
                    cur.vdsbs_id = parseInt(cur.vdsbs_id as string);

                    newDate.push(cur as InvoiceInterface);
                } catch (err) {
                    //
                }
            } else if (this.type === "psi") {
                return data;
            }
            return newDate;
        }

        return data;
    }

    public validate() {
        const data = this.data;
        if (this.type === "psi") {
            for (let i = 0; i < data.length; i++) {
                const keys = Object.keys(data[i]);
                for (let j = 0; j < keys.length; j++) {
                    try {
                        console.log({ [keys[j]]: data[i][keys[j]] });
                        const { error } = this.PSIValidatonSchema()
                            .extract(keys[j])
                            .validate(data[i][keys[j]]);
                        error &&
                            this.errorObj.set(
                                keys[j],
                                error?.message.replace(
                                    this.erorrKeyGen(error?.message)!,
                                    Object.keys(error._original)[0]
                                )
                            );
                    } catch (err) {
                        continue;
                    }
                }
            }
        } else if (this.type === "vi") {
            const data = this.transform(this.data)[0] as InvoiceInterface;
            console.log("data", data);
            const keys = Object.keys(data);
            for (let j = 0; j < keys.length; j++) {
                try {
                    const { error } = this.invoiceIntefaceValidationSchema()
                        .extract(keys[j])
                        .validate({ [keys[j]]: data[keys[j]] });
                    console.log({ [keys[j]]: data[keys[j]] });
                    console.log("errors", error);
                    error &&
                        this.errorObj.set(
                            keys[j],
                            error?.message.replace(
                                this.erorrKeyGen(error?.message)!,
                                Object.keys(error._original)[0]
                            )
                        );
                } catch (err) {
                    continue;
                }
            }
        } else throw new Error("not found");
    }
}

export default DataVerifier;
