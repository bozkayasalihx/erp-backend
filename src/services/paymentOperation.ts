import { Payment, PaymentMatches, PaymentSchedule } from "../models";
import BaseService from "./BaseService";

export class PaymentOperation extends BaseService {
    private Models = {
        PaymentSchedule,
        PaymentMatches,
        Payment,
    };
    public get paymentRepo() {
        return this.source.getRepository(this.Models.Payment);
    }

    public get psRepo() {
        return this.source.getRepository(this.Models.PaymentSchedule);
    }

    public get pmRepo() {
        return this.source.getRepository(this.Models.PaymentMatches);
    }

    public createPayment(params: Partial<Payment>) {
        return this.paymentRepo.insert({ ...params });
    }

    public createPS(params: Partial<PaymentSchedule>) {
        return this.psRepo.insert({ ...params });
    }

    public createPM(params: Partial<PaymentMatches>) {
        return this.pmRepo.insert({ ...params });
    }
}
export default new PaymentOperation();
