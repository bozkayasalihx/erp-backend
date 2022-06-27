import { hashSync } from "bcryptjs";
import {
    createReadStream,
    createWriteStream,
    ReadStream,
    WriteStream,
} from "node:fs";
import path from "node:path";
import { Pool, PoolConfig } from "pg";

const config: PoolConfig = {
    database: "test",
    port: 5432,
    password: "postgres",
    user: "postgres",
};

class Inserter extends Pool {
    private readStream: ReadStream;

    private writerStream: WriteStream;

    private errorCounter: number;

    private successCounter: number;

    private path = path;

    private USER_ENTITY = "user_entity_relations";

    public head: string;

    constructor(private table: string) {
        super(config);
        const csvPath = `${this.path.resolve("./csv", table)}.csv`;
        this.readStream = createReadStream(this.curDir(csvPath), {
            highWaterMark: 8192,
        });
        this.writerStream = createWriteStream(this.curDir("../results.csv"), {
            encoding: "utf-8",
            highWaterMark: 8192,
            autoClose: true,
        });
        this.errorCounter = 0;
        this.successCounter = 0;
    }

    private curDir(...curPath: Array<string>) {
        return this.path.resolve(__dirname, ...curPath);
    }

    public get countError() {
        return this.errorCounter;
    }

    public get countSuccess() {
        return this.successCounter;
    }

    private sleep(ms: number) {
        return new Promise((res) => {
            setTimeout(res, ms);
        });
    }

    private strigifier(dataSet: string) {
        const columValues = dataSet.split(",");
        const passIndex = this.handleIndex(this.head);
        let str = "";
        for (let i = 0; i < columValues.length; i++) {
            if (i === passIndex) columValues[i] = hashSync(columValues[i], 10);
            if (i === columValues.length - 1) str += `'${columValues[i]}'`;
            else str += `'${columValues[i]}',`;
        }
        return str;
    }

    private headerWrapper(header: string) {
        return `(${header})`;
    }

    private header(data: string) {
        this.head = data;
    }

    private handleIndex(data: string) {
        const headers = data.split(",");
        return headers.indexOf("password");
    }

    private counter = 0;

    private random() {
        const cols = [
            "vendor_table_ref_id",
            "buyer_site_table_ref_id",
            "dealer_site_table_ref_id",
        ];

        return cols[Math.floor(Math.random() * cols.length)];
    }

    public streamData() {
        let unProcessed = "";
        this.readStream.on("data", (chunk: string) => {
            const chunkString = unProcessed + chunk.toString();
            unProcessed = "";
            let startIndex = 0;
            for (let ch = startIndex; ch < chunkString.length; ch++) {
                if (chunkString[ch] === "\n") {
                    this.counter++;
                    const line = chunkString.slice(startIndex, ch);
                    if (this.counter === 1) {
                        this.header(line);
                        if (this.table === this.USER_ENTITY) {
                            const header = this.head;
                            const willRemovedColumns = header
                                .split(",")
                                .splice(-3, 3)
                                .join(",");
                            const random = this.random();
                            const newHeader = header.replace(
                                willRemovedColumns,
                                random
                            );
                            this.header(newHeader);
                        }
                        continue;
                    }

                    if (this.table === this.USER_ENTITY) {
                        const header = this.head;
                        const willRemovedColumns = header
                            .split(",")
                            .splice(-1, 1)
                            .join(",");
                        const random = this.random();
                        const newHeader = header.replace(
                            willRemovedColumns,
                            random
                        );
                        const deleted = line.split(",").splice(-3, 3);
                        const firstOne = deleted[0];
                        const newLine = line.replace(
                            deleted.join(","),
                            firstOne
                        );
                        try {
                            this.sql(newHeader, newLine);
                        } catch (err) {
                            continue;
                        }
                    } else {
                        try {
                            this.sql(this.head, line);
                        } catch (err) {
                            continue;
                        }
                    }
                    startIndex = ch + 1;
                }
                if (chunkString[chunkString.length - 1] !== "\n") {
                    unProcessed = chunkString.slice(startIndex);
                }
            }
        });

        this.readStream.on("end", () => {
            // console.log("done...");
            // this.writerStream.end();
        });
    }

    private sql(header: string, line: string) {
        const columnValues = this.strigifier(line);
        const sql = `INSERT INTO ${this.table} ${this.headerWrapper(
            header
        )} VALUES (${columnValues})`;

        this.connect((err, client, done) => {
            if (err) throw new Error(err.message);
            client.query(sql, (err1) => {
                done();
                if (err1) {
                    this.errorCounter += 1;
                    this.writerStream.write(sql);
                } else {
                    this.successCounter += 1;
                }
            });
        });
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const main = async () => {
    const arrDir: Set<string> = new Set([
        "users",
        "vendors",
        "vendor_regions",
        "buyers",
        "buyer_sites",
        "dealers",
        "dealer_sites",
        "vds_relations",
        "vdsbs_relations",
        "user_entity_relations",
        "dealer_route_users",
    ]);
    for (const item of arrDir) {
        const insert = new Inserter(item);
        try {
            insert.streamData();
            insert.on("connect", () => {
                // eslint-disable-next-line no-console
                console.log("client connected");
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log("err", err);
            continue;
        }
    }
};

const insert = new Inserter(process.argv[2]);
insert.streamData();
