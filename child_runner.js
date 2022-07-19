/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// const spawn = require("cross-spawn");
const { spawn } = require("./dist/scripts/spawn");
const controller = new AbortController();

const watch = spawn("yarn", ["watch"], { signal: controller.signal });
const dev = spawn("yarn", ["dev"], { signal: controller.signal });

watch.stdout.on("data", (data) => {
    console.log(data.toString());
});

dev.stdout.on("data", (data) => {
    console.log(data.toString());
});

watch.stderr.on("data", (data) => {
    console.log(data);
    controller.abort();
});

dev.stderr.on("data", (data) => {
    console.log(data.toString());
    controller.abort();
});

watch.on("close", (code, signal) => {
    controller.abort();
    watch.kill(signal);
});

dev.on("close", (code, signal) => {
    controller.abort();
    dev.kill(signal);
});
