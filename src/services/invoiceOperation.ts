import { Invoice } from "../models";
import BaseService from "./BaseService";

export class InvoiceOperation extends BaseService {
    private Model = Invoice;
    public get repo() {
        return this.source.getRepository(this.Model);
    }

    public createInvoice(params: Partial<Invoice>) {
        return this.repo.insert(params);
    }
}

export default new InvoiceOperation();
