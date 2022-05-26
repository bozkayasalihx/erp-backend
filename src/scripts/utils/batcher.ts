import { BaseEntity } from "typeorm";

class Batcher {
    constructor(private data: Set<Record<string, any>>) {}

    public dataLoader(table: BaseEntity) {
        const data = this.data;
        for (let i = 0; i < data.size; i++) {
            //
        }
    }

    public middleFinder() {
        const len = this.data.size;
        // const maker =
    }
}
// export default new Batcher();
