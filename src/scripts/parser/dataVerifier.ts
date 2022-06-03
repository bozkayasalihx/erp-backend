import dayjs from "dayjs";
import Joi from "joi";
import { IInvoice } from "../../controllers/invoice/createInvoice";
import { IPaymentSchedule } from "../../controllers/payment/createPayment";
import { InvoiceInterface, PaymentScheduleInterface } from "../../models";
import { Currency, InvoiceStatusType } from "../../types/types";

type Tabletype = "psi" | "vi";

type PSIDataType = Partial<PaymentScheduleInterface>;
type VIDataType = Partial<InvoiceInterface>;

enum ErrorSecondName {
    PAYMENT = "payment_schedule_interface",
    INVOICE = "invoice_interface",
}
class DataVerifier {
    private type: Tabletype;
    private data: { psi: Array<PSIDataType>; vi: Array<VIDataType> };
    private errorObj: Map<string, any> = new Map();
    private dateFormater = dayjs;
    private dateFormat = "DD/MM/YYYY";

    constructor(type: Tabletype) {
        this.type = type;
        this.data = {
            psi: [],
            vi: [],
        };
    }

    public get errors() {
        return this.errorObj;
    }

    public setPSIData(data: Array<PSIDataType>) {
        this.data.psi = data;
    }
    public setVIData(data: Array<VIDataType>) {
        this.data.vi = data;
    }

    public get getVIData() {
        return this.data.vi;
    }

    public get getPSIData() {
        return this.data.psi;
    }

    private erorrKeyGen(err: string) {
        const res = /"([^"]*)"/gi.exec(err);
        if (res) return res[1];
        return null;
    }

    private strToFloat(str: string) {
        return parseFloat(str.replace(",", "."));
    }

    private strToInt(str: string) {
        return parseInt(str);
    }

    private invoiceIntefaceValidationSchema() {
        return Joi.object<IInvoice>({
            currency: Joi.object({
                currency: Joi.valid(...Object.values(Currency)).required(),
            }),
            invoice_no: Joi.object({
                invoice_no: Joi.string().required().max(30).required(),
            }),
            invoice_date: Joi.object({
                invoice_date: Joi.date().required(),
            }),
            amount: Joi.object({ amount: Joi.number().required() }),
            status: Joi.object({
                status: Joi.valid(
                    ...Object.values(InvoiceStatusType)
                ).required(),
            }),
            ref_file_id: Joi.object({
                ref_file_id: Joi.number().required(),
            }),
            due_date: Joi.object({ due_date: Joi.date().required() }),
            vdsbs_id: Joi.object({
                vdsbs_id: Joi.number().required(),
            }),
        });
    }

    private PSIValidatonSchema() {
        return Joi.object<
            IPaymentSchedule & {
                line_no: number;
                due_date: Date;
                amount: number;
            }
        >({
            currency: Joi.object({
                currency: Joi.valid(...Object.values(Currency)).required(),
            }),

            vdsbs_id: Joi.object({
                vdsbs_id: Joi.number().required(),
            }),
            line_no: Joi.object({
                line_no: Joi.number().required(),
            }),
            invoiced_status: Joi.object({
                invoiced_status: Joi.valid(
                    ...Object.values(InvoiceStatusType)
                ).required(),
            }),
            due_date: Joi.object({
                due_date: Joi.date().required(),
            }),
            amount: Joi.object({
                amount: Joi.number().required(),
            }),
        });
    }

    private transform() {
        const newData: { psi: Array<PSIDataType>; vi: Array<VIDataType> } = {
            psi: [],
            vi: [],
        };

        if (this.type === "vi") {
            for (let i = 0; i < this.data.vi.length; i++) {
                const cur = this.data.vi[i] as VIDataType;
                try {
                    //@ts-ignore
                    cur.amount = this.strToFloat(cur.amount);
                    cur.due_date = this.dateFormater(cur.due_date).format(
                        this.dateFormat
                    );
                    cur.invoice_date = this.dateFormater(
                        cur.invoice_date
                    ).format(this.dateFormat);
                    //@ts-ignore
                    cur.vdsbs_id = this.strToInt(cur.vdsbs_id);
                    newData.vi.push(cur as InvoiceInterface);
                } catch (err) {
                    console.log("err", err);
                }
            }
        } else if (this.type === "psi") {
            for (let i = 0; i < this.data.psi.length; i++) {
                try {
                    //@ts-ignore
                    this.data.psi[i].amount = this.strToFloat(
                        this.data.psi[i].amount as string
                    );

                    //@ts-ignore
                    this.data.psi[i].due_date = this.dateFormater(
                        this.data.psi[i].due_date
                    ).format(this.dateFormat);

                    //@ts-ignore
                    this.data.psi[i].vdsbs_id = this.strToInt(
                        this.data.psi[i].vdsbs_id as string
                    );

                    //@ts-ignore
                    this.data.psi[i].line_no = this.strToInt(
                        this.data.psi[i].line_no as string
                    );

                    newData.psi.push(this.data.psi[i]);
                } catch (err) {
                    console.log("err", err);
                }
            }
        }

        this.data = newData;
        return newData;
    }

    public validate() {
        this.transform();
        for (let i = 0; i < this.data[this.type].length; i++) {
            const keys = Object.keys(this.data[this.type][i]);
            const schema =
                this.type === "psi"
                    ? this.PSIValidatonSchema
                    : this.invoiceIntefaceValidationSchema;

            for (let j = 0; j < keys.length; j++) {
                try {
                    const { error } = schema()
                        .extract(keys[j])
                        .validate({
                            [keys[j]]: this.data[this.type][i][keys[j]],
                        });
                    error &&
                        this.errorObj.set(
                            `${i}__${keys[j]}`,
                            error.message.replace(
                                this.erorrKeyGen(error?.message)!,
                                Object.keys(error._original)[0]
                            )
                        );
                } catch (err) {
                    continue;
                }
            }
        }
    }
}

export default DataVerifier;
