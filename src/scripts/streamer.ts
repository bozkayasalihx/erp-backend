/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import fs from "fs";

export const streamController = new AbortController();

export default class Streamer {
    public readData(data: string | Buffer, cb: (line: string) => void) {
        let unProcessed = "";
        let startIndex = 0;

        for (let ch = startIndex; ch < data.length; ch++) {
            const chstring = unProcessed + data.toString();
            unProcessed = "";
            if (chstring[ch] === "\n") {
                const line = chstring.slice(startIndex, ch);
                // console.log(line);
                console.log("ch", ch);

                startIndex = ch + 1;
            }
            if (chstring[chstring.length - 1] !== "\n") {
                unProcessed = chstring.slice(startIndex);
                // console.log(unProcessed);
            }
        }
    }
}

const readStream = fs.createReadStream("../results.csv");
const streamer = new Streamer();

readStream.on("data", (ch) => {
    streamer.readData(ch, (line) => {
        // console.log("line", line);
    });
});
readStream.on("end", () => {});

/**
 *  const streamer = new Streamer() :
 *  this.on('data', (chunk) =>{
 *
 *  streamer.readData(chunk);
 *  const line = streamer.getLine();
 *
 *  do whatever with lfine ;
 *
 *
 * })
 */
