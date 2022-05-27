type Data = Set<Record<string, any>>;
class CsvParser {
    private data: string;
    private delimiter: string;
    private newLineOrTabRemoveRegex = /(\r\n|\n|\r)/gm;
    private fullset: Data;
    private RELATED_USER = "related_users";
    private CURRENCY = "currency";

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
        const delimiter = this.delimiter;
        const headerItem = this.header.split(delimiter);
        let i = 0;
        while (i < headerItem.length) {
            headerItem[i] = headerItem[i].replace(
                this.newLineOrTabRemoveRegex,
                ""
            );
            i++;
        }
        return headerItem;
    }

    public transformBody() {
        const body = this.body;
        const delimiter = this.delimiter;
        const returnType: Map<number, Array<string>> = new Map();
        let i = 0;
        while (i < body.length) {
            const eachItem = body[i].trim().split(delimiter);
            for (let j = i; j < eachItem.length; j++) {
                //@ts-ignore
                if (!eachItem[j]) eachItem[j] = null;
                else {
                    eachItem[j] = eachItem[j].replace(
                        this.newLineOrTabRemoveRegex,
                        ""
                    );
                }
            }
            returnType.set(i, eachItem);
            i++;
        }

        return returnType;
    }

    public matcher(cb: (data: Data) => void) {
        const body = this.transformBody();
        const header = this.transformHeader();
        let headerCurrency: string;
        const fullSet: Set<Record<string, any>> = new Set();
        for (const [key, values] of body) {
            // [{ record_type: h},...}];
            // which means its header
            const newObj = {};
            values.reduce((acc, cur, idx) => {
                // current object property name;
                const curHeader = header[idx];

                if (key === 0) {
                    if (curHeader === this.CURRENCY) headerCurrency = cur;
                }
                if (curHeader === this.CURRENCY) {
                    if (!cur) cur = headerCurrency;
                }
                if (curHeader === this.RELATED_USER) cur = JSON.parse(cur);
                const newOne = (newObj[curHeader] = cur);
                return { ...acc, newOne };
            }, {} as Record<string, any>);
            fullSet.add(newObj);
        }
        this.fullset = fullSet;
        cb(fullSet);
    }

    public log() {
        // console.log(this.transformBody());
        // console.log(this.transformHeader());
    }
}

export default CsvParser;
