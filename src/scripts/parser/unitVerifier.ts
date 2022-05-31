import dayjs from "dayjs";
import Joi from "joi";
import { Currency, FileRecordType, HAS_PS } from "../../types/types";
export default class UnitVerifier {
    // remember RSP:
    private dateFormater = dayjs;
    private _joi = Joi;
    protected error: Map<string, string> = new Map();

    private dateVerifier(date: string) {
        return this.dateFormater(date).isValid();
    }

    private recordTypeVerifier(data: string) {
        if (Object.values(FileRecordType).indexOf(data as any) !== -1) {
            return true;
        }
        return false;
    }

    protected intVerifier(data: string) {
        try {
            return parseInt(data, 10);
        } catch (err) {
            this.error.set(data, "invalid integer type");
            return false;
        }
    }

    private hasPs(data: string) {
        if (Object.values(HAS_PS).indexOf(data as any) !== -1) {
            return true;
        }
        return false;
    }

    private currencyVerifier(data: string) {
        if (Object.values(Currency).indexOf(data as any) !== -1) {
            return true;
        }
        return false;
    }

    protected validateDate(data: string) {
        if (!this.dateVerifier(data)) {
            this.error.set(data, "invalid date type");
            return;
        }

        return this.dateFormater(data).toDate();
    }

    protected recordTypeValidator(data: string) {
        if (!this.recordTypeVerifier(data)) {
            this.error.set(data, "invalid record type");
        }
    }

    protected PSValidator(data: string) {
        if (!this.hasPs(data))
            this.error.set(data, "value must be boolean (Y,N)");
    }

    protected validateCurrency(data: string) {
        if (!this.currencyVerifier(data))
            this.error.set(data, `that data not in ${Object.values(Currency)}`);
    }
}
