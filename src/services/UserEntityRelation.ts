import { UserEntityRelation } from "../models";
import BaseService from "./BaseService";

class UserEntityRelationOperation extends BaseService {
    public get repo() {
        return this.source.getRepository(UserEntityRelation);
    }
}

export default new UserEntityRelationOperation();
