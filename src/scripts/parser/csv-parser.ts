import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import { join, resolve } from "node:path";
import { EventEmitter } from "node:stream";
import { promisify } from "node:util";

type OnNames = "data" | "drain";

type IData = {
    data: string;
    fileName: string;
};
type ObjectType = {
    key: string;
    value: string;
};

declare interface Parser extends EventEmitter {
    on(eventName: OnNames, listener: (...args: any[]) => void): this;
}

class Parser extends EventEmitter {
    private glob = promisify(glob);
    private path: string;
    private obj: Record<string, string> = {};
    private writeFile = promisify(writeFile);
    private dist = resolve("../writer");
    constructor(path: string) {
        super();
        this.path = path;
    }

    private async getFile() {
        try {
            const paths = await this.glob(this.path);
            return paths[0];
        } catch (err) {
            console.log("err", err);
            throw new Error(JSON.stringify(err));
        }
    }

    private async readData() {
        const path = await this.getFile();
        const contents = (await readFile(path)).toString().split("\n");
        return contents;
    }

    private cleanUp(clean: string | Array<string>) {
        const regex = /\s\r\n/gi;
        if (typeof clean === "string") {
            return clean.replace(regex, "");
        }
        const strings: Array<string> = [];
        for (let i = 0; i < clean.length; i++) {
            clean[i].replace(regex, "");
            strings.push(clean[i]);
        }

        return strings;
    }

    public async writer({ data, fileName }: IData) {
        const filePath = join(this.dist, fileName);
        try {
            await this.writeFile(filePath, data, {
                encoding: "utf-8",
                flag: "a",
            });
            return true;
        } catch (err) {
            console.log("err", err);
            return false;
        }
    }

    private commndDetector(data: string) {
        const regex = new RegExp(/\s*,\s*|\s+,/gi);
        return data.replace(regex, "\n");
    }

    async parseData() {
        const contens = await this.readData();
        const header = contens[0];
        const lines = contens.splice(1);

        return {
            header,
            lines,
        };
    }

    async extractData() {
        const { header, lines } = await this.parseData();
        const linesData = this.cleanUp(lines);
        const headerData = this.cleanUp(header);

        return {
            linesData,
            headerData,
        };
    }

    public lineSplit(data: Array<string>) {
        // return this.commndDetector(data).split("\n");
        return data.reduce((acc, cur, idx) => {
            acc[idx] = this.commndDetector(cur).split("\n");
            return acc;
        }, {} as Record<string, Array<string>>);
    }

    public toObject({ key, value }: ObjectType) {
        this.obj = { ...this.obj, [key]: value };
    }
    public get jsonValue() {
        return JSON.stringify(this.obj, null, 2);
    }
}
const parser = new Parser("../storage/*.csv");
parser
    .extractData()
    .then(async ({ headerData, linesData }) => {
        const m = parser.lineSplit([headerData as string]);
        const p = parser.lineSplit(linesData as string[]);
        console.log("m", m);
        console.log("p", p);
        const matches = m[0];
        const otherSideMatches = p[0];
        for (let i = 0; i < matches.length; i++) {
            parser.toObject({ key: matches[i], value: otherSideMatches[i] });
        }

        console.log(parser.jsonValue);
    })
    .catch((err) => console.log("err", err));
