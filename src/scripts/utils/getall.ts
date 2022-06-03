type Data<T> = Array<T>;

function getAll<T>(data: Data<T>, cb: (str: T) => void) {
    for (let i = 0; i < data.length; i++) {
        cb(data[i]);
    }
}

export default getAll;
