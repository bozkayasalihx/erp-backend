import Joi, { ValidationErrorItem } from "joi";
import { FindOptionsWhere } from "typeorm";
import { IInvoice } from "../../controllers/invoice/createInvoice";
import { IPaymentSchedule } from "../../controllers/payment/createPayment";
import { InvoiceInterface, PaymentScheduleInterface } from "../../models";
import { invoiceOperation, paymentOperation } from "../../services";
import { Currency, InvoiceStatusType, PaymentType } from "../../types/types";

type Tabletype = "psi" | "vi";

type DataType = PaymentScheduleInterface | InvoiceInterface;

enum ErrorSecondName {
    PAYMENT = "payment_schedule_interface",
    INVOICE = "invoice_interface",
}

class DataVerifier {
    private type: Tabletype;
    private data: Array<DataType>;
    private paymentOP = paymentOperation;
    private invoiceOP = invoiceOperation;
    private Joi = Joi;
    public errorObj: Map<string, any>;

    constructor(type: Tabletype) {
        this.type = type;
    }

    public async setter(whereClause: FindOptionsWhere<DataType>) {
        if (this.type == "vi") {
            try {
                const resl = await this.invoiceOP.invoiceInterface.find({
                    where: whereClause as FindOptionsWhere<InvoiceInterface>,
                });
                this.data = resl;
            } catch (err) {
                this.errorObj.set(err?.message ?? ErrorSecondName.INVOICE, err);
            }
        } else if (this.type === "psi") {
            try {
                const resl = await this.paymentOP.PSIRepo.find({
                    where: whereClause as FindOptionsWhere<PaymentScheduleInterface>,
                });
                this.data = resl;
            } catch (err) {
                this.errorObj.set(err?.message ?? ErrorSecondName.PAYMENT, err);
            }
        } else throw new Error("enter vaid table name");
    }

    private errorSlugify(error: Array<ValidationErrorItem>) {
        return error
            .map((detail) => {
                return detail.message;
            })
            .join(", ");
    }

    private erorrKeyGen(err: string) {
        const regex = /"\."/gi;
        return regex.exec(err);
    }

    private invoiceIntefaceValidationSchema() {
        return this.Joi.object<IInvoice>({
            currency: this.Joi.valid(...Object.values(Currency)).required(),
            invoice_no: this.Joi.string().required().min(30).max(30).required(),
            invoice_date: this.Joi.date().required(),
            invoice_amount: this.Joi.number().required(),
            status: this.Joi.valid(
                ...Object.values(InvoiceStatusType)
            ).required(),
            ref_file_id: this.Joi.number().required(),
            due_date: this.Joi.date().required(),
            vdsbs_id: this.Joi.number().required(),
        });
    }

    private PSIValidatonSchema() {
        return this.Joi.object<IPaymentSchedule>({
            currency: this.Joi.valid(...Object.values(Currency)).optional(),
            remained_amount: this.Joi.number().required(),
            effective_date: this.Joi.date().required(),
            invoiced_status: this.Joi.valid(
                ...Object.values(InvoiceStatusType)
            ).optional(),
            original_amount: this.Joi.number().required(),
            payment_type: this.Joi.valid(
                ...Object.values(PaymentType)
            ).optional(),
            reference_id: this.Joi.number().required(),
            vdsbs_id: this.Joi.number().required(),
        });
    }

    public validate() {
        const data = this.data;
        if (this.type === "psi") {
            for (let i = 0; i < data.length; i++) {
                const { error } = this.PSIValidatonSchema().validate(data[i]);
                if (error) {
                    const slugedError = this.errorSlugify(error.details);
                    const maker = this.erorrKeyGen(slugedError);
                    console.log("maker", maker);
                }
            }
        } else if (this.type === "vi") {
            for (let j = 0; j < data.length; j++) {
                const { error } =
                    this.invoiceIntefaceValidationSchema().validate(data[j]);
                if (error) {
                    const slugedError = this.errorSlugify(error.details);
                    const maker2 = this.erorrKeyGen(slugedError);
                    console.log("maker 2", maker2);
                }
            }
        }
        throw new Error("not found");
    }
}

export default DataVerifier;
