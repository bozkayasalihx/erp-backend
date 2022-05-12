import { DataSource } from "typeorm";
import { appDataSource } from "../loaders";

export default class BaseService {
    private dataSource: DataSource;
    protected get source() {
        return this.dataSource;
    }
    constructor() {
        this.dataSource = appDataSource;
    }
}
