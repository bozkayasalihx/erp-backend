class CsvParser<T> {
    private data: string;

    private delimiter: string;

    private newLineOrTabRemoveRegex = /(\r\n|\n|\r|\\r|\s)/gim;

    private fullset: Set<T>;

    private RELATED_USER = "related_users";

    private CURRENCY = "currency";

    private has_ps = "has_ps";

    private newLine = "\n";

    constructor(delimiter = ",") {
        this.delimiter = delimiter;
    }

    public readData(data: string) {
        this.data = data;
    }

    private get getData() {
        return this.data;
    }

    public get parsedData() {
        return this.fullset;
    }

    private get dataArray() {
        return this.getData.split("\n");
    }

    private senitizer(data: string) {
        return data.replace(this.newLineOrTabRemoveRegex, "");
    }

    public get header() {
        const header = this.dataArray[0];
        return header;
    }

    public get body() {
        const body: Array<string> = [];
        for (let i = 0; i < this.dataArray.length; i++) {
            if (i === 0) continue;
            body.push(this.dataArray[i]);
        }
        return body;
    }

    private transformHeader() {
        const { delimiter } = this;
        const headerItem = this.header.split(delimiter);
        let i = 0;
        while (i < headerItem.length) {
            headerItem[i] = this.senitizer(headerItem[i]);
            i++;
        }

        return headerItem;
    }

    public transformBody() {
        const { body } = this;
        const { delimiter } = this;
        const returnType: Record<number, Array<string>> = {};
        let i = 0;
        while (i < body.length) {
            if (body[i] === this.newLine) {
                break;
            }
            const eachItem = body[i].trim().split(delimiter);
            for (let j = i; j < eachItem.length; j++) {
                // @ts-ignore
                if (!eachItem[j]) eachItem[j] = null;
                else {
                    eachItem[j] = this.senitizer(eachItem[j]);
                }
            }
            returnType[i] = eachItem;
            i++;
        }

        return returnType;
    }

    private sameLength(d1: any[], d2: any[]) {
        if (d1.length === d2.length) return true;
        return false;
    }

    public matcher(cb: (err: Error | null, data?: Set<T>) => void) {
        const body = this.transformBody();
        const header = this.transformHeader();
        let headerCurrency: string | null = null;
        let headerHasPs: string | null = null;
        const fullSet: Set<T> = new Set();
        for (let j = 0; j < Object.keys(body).length; j++) {
            const values = Object.values(body[j]);
            if (!values[0]) return cb(new Error("empty new line not allowed"));
            if (!this.sameLength(values, header))
                return cb(new Error("header and body must be same length"));
            let chunk: T = {} as T;
            for (let i = 0; i < values.length; i++) {
                if (j === 0) {
                    if (header[i] === this.CURRENCY) headerCurrency = values[i];
                    if (header[i] === this.has_ps) headerHasPs = values[i];
                }

                if (header[i] === this.CURRENCY) {
                    if (!values[i]) values[i] = headerCurrency as string;
                } else if (header[i] === this.has_ps) {
                    if (!values[i]) values[i] = headerHasPs as string;
                }
                if (header[i] === this.RELATED_USER)
                    values[i] = JSON.parse(values[i]);
                chunk[header[i]] = values[i];
            }
            fullSet.add(chunk);
            chunk = {} as T;
        }
        this.fullset = fullSet;
        return cb(null, fullSet);
    }
}

export default CsvParser;
export const csvParserInstance = new CsvParser();
