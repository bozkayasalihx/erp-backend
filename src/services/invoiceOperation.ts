import { Invoice, InvoiceInterface, InvoiceLine } from "../models";
import BaseService from "./BaseService";

export class InvoiceOperation extends BaseService {
    private Model = {
        Invoice,
        InvoiceLine,
    };
    public get invoiceRepo() {
        return this.source.getRepository(this.Model.Invoice);
    }

    public get invoiceInterface() {
        return this.source.getRepository(InvoiceInterface);
    }

    public get invoiceLineRepo() {
        return this.source.getRepository(this.Model.InvoiceLine);
    }

    public createInvoice(params: Partial<Invoice>) {
        return this.invoiceRepo.insert(params);
    }
    public createInvoiceLine(params: Partial<InvoiceLine>) {
        return this.invoiceLineRepo.insert({ ...params });
    }

    public createInvoiceInterface(params: Partial<InvoiceInterface>) {
        return this.invoiceInterface.insert({ ...params });
    }
}

export default new InvoiceOperation();
