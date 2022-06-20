import { UserEntityAccessV } from "../models";
import { setActiveConditions } from "../scripts/utils/viewFunctions";
import BaseService from "./BaseService";

export class UserEntityAccessOperation extends BaseService {
    public get repo() {
        return this.source.getRepository(UserEntityAccessV);
    }

    // function will return all user-enitity access records regardless of user_id
    public async getAll(onlyActives = true) {
        let access_list: UserEntityAccessV[] = [];

        if (!onlyActives) {
            access_list = await this.repo.find();
        } else {
            let qBuilder = this.repo.createQueryBuilder("uea").where("1=1");

            // set active conditions
            qBuilder = setActiveConditions(qBuilder);

            access_list = await qBuilder.getMany();
        }

        return access_list;
    }

    // function will return all user-enitity access records filtered by given user_id
    public async getByUser(user_id: number, onlyActives = true) {
        let access_list: UserEntityAccessV[] = [];

        if (!onlyActives) {
            access_list = await this.repo.find({
                where: { user_id: user_id },
            });
        } else {
            let qBuilder = this.repo.createQueryBuilder("uea").where("1=1");

            qBuilder = qBuilder.andWhere(`"uea"."user_id" = ${user_id}`);

            // set active conditions
            qBuilder = setActiveConditions(qBuilder);

            access_list = await qBuilder.getMany();
        }

        return access_list;
    }
}

export default new UserEntityAccessOperation();
