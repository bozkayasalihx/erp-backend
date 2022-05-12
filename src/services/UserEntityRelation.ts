import { appDataSource } from "../loaders";
import { UserEntityRelation } from "../models";
import BaseService from "./BaseService";

class UserEntityRelationOperation extends BaseService {
    constructor() {
        super();
    }

    public get repo() {
        return appDataSource.getRepository(UserEntityRelation);
    }
}

export default new UserEntityRelationOperation();
