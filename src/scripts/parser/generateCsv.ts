import fs from "node:fs/promises";
import path from "node:path";
import type { Data } from "./csvParser";

type DataType = Array<Record<string, any>>;

export class GenerateCsv {
    private data: DataType;
    private fs = fs;
    private path = path;
    private DELIMITER: string;
    private NEW_LINE = "\n";
    constructor(
        private errors: Map<string, any>,
        private parsedData: Data,
        delimiter = ";"
    ) {
        this.data = [...this.parsedData];
        this.DELIMITER = delimiter;
    }

    private longestPropIndex(data: DataType) {
        let i = 0;
        let longest = 0;
        let index = 0;
        while (i < data.length) {
            const keys = Object.keys(data[i]);
            if (keys.length > longest) {
                longest = keys.length;
                index = i;
            }

            i++;
        }
        return index;
    }

    private parseErrors() {
        for (const [key, value] of this.errors) {
            const [lineNO, name] = key.split("__");
            if (!this.data[+lineNO]["errors"])
                this.data[+lineNO]["errors"] = [value];
            else
                this.data[+lineNO]["errors"] = [
                    ...this.data[+lineNO]["errors"],
                    value,
                ];
        }
        return { data: this.data };
    }

    private genHeader(header: string[]) {
        return header.join(this.DELIMITER).trim();
    }

    public async genereate(fileName: string) {
        const { data } = this.parseErrors();
        const index = this.longestPropIndex(data);
        let willBeWrittenData = "";
        const csvHeader = this.genHeader([...Object.keys(data[index])]);
        willBeWrittenData += csvHeader + this.NEW_LINE;
        let j = 0;
        for (let i = 0; i < data.length; i++) {
            for (const [key, value] of Object.entries(data[i])) {
                console.log("value", value);
                if (j == 0) willBeWrittenData += value;
                else {
                    if (!value) willBeWrittenData += this.DELIMITER;
                    else if (value instanceof Array)
                        willBeWrittenData += this.DELIMITER + "[" + value + "]";
                    else willBeWrittenData += this.DELIMITER + value;
                }
                j++;
            }
            j = 0;
            willBeWrittenData += this.NEW_LINE;
        }

        await this.fs.writeFile(
            this.path.resolve(__dirname, "../../../src/public/", fileName),
            willBeWrittenData
        );
    }
}
