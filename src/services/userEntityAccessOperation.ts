import { UserEntityAccessV } from "../models";
import { setActiveConditions } from "../scripts/utils/viewFunctions";
import BaseService from "./BaseService";

export class UserEntityAccessOperation extends BaseService {
    public get repo() {
        return this.source.getRepository(UserEntityAccessV);
    }

    // function will return all user-enitity access records regardless of user_id
    public async getAll(onlyActives = true) {
        let accessList: UserEntityAccessV[] = [];

        if (!onlyActives) {
            accessList = await this.repo.find();
        } else {
            let qBuilder = this.repo.createQueryBuilder("uea").where("1=1");

            // set active conditions
            qBuilder = setActiveConditions(qBuilder);

            accessList = await qBuilder.getMany();
        }

        return accessList;
    }

    // function will return all user-enitity access records filtered by given user_id
    public async getByUser(userId: number, onlyActives = true) {
        let accessList: UserEntityAccessV[] = [];

        if (!onlyActives) {
            accessList = await this.repo.find({
                where: { user_id: userId },
            });
        } else {
            let qBuilder = this.repo.createQueryBuilder("uea").where("1=1");

            qBuilder = qBuilder.andWhere(`"uea"."user_id" = ${userId}`);

            // set active conditions
            qBuilder = setActiveConditions(qBuilder);

            accessList = await qBuilder.getMany();
        }

        return accessList;
    }
}

export default new UserEntityAccessOperation();
