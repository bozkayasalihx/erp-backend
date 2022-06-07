type Data<T> = Array<T>;
type Maybe<T> = Promise<T> | T;

async function getAll<T>(data: Data<T>, cb: (str: T) => Maybe<void>) {
    for (let i = 0; i < data.length; i++) {
        await cb(data[i]);
    }
}

export default getAll;
