import cp, { ChildProcess, SpawnOptions } from "child_process";
import { parse } from "./parse";

export function spawn(
    command: string,
    args?: string[],
    options?: SpawnOptions | string[]
): ChildProcess {
    const parsed = parse(command, args, options);
    const spawned = cp.spawn(
        parsed.command,
        parsed.args as readonly string[],
        parsed.options as SpawnOptions
    );

    return spawned;
}
