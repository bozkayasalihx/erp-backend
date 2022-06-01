export function isContain(params: Record<string, any>) {
    const hashMap = {};
    const error: { invalid: boolean } = { invalid: false };
    const validOne: { [x: string]: number } = {};
    let i = 0;
    for (const [key, value] of Object.entries(params)) {
        if (value) {
            validOne[key] = value;
            i++;
        }
        if (i > 1) error["invalid"] = true;
        if (!(key in hashMap)) hashMap[key] = value;
    }
    i = 0;
    return {
        hashMap,
        error,
        validOne,
    };
}
