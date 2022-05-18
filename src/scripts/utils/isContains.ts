export function isContain(params: Record<string, any>) {
    const hashMap = new Map<string, number>();
    for (const [key, value] of Object.entries(params)) {
        if (value) {
            if (!hashMap.get(key)) hashMap.set(key, value);
        }
    }
    return hashMap;
}
