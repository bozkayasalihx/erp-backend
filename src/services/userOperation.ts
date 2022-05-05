import { appDataSource } from "../loaders";
import { User } from "../models";

export class UserOperation {
    private get source() {
        return appDataSource;
    }

    get repo() {
        return this.source.getRepository(User);
    }
    public async insert(user: Partial<User>) {
        const newUser = this.repo.create(user);

        return this.repo.save(newUser);
    }

    public async update(user: Partial<User>) {
        return this.repo.save(user);
    }
    public async login(email: string, username?: string) {
        return this.repo.findOne({ where: [{ email }, { username }] });
    }

    public creatUser(params: Partial<User>) {
        return this.repo.create(params);
    }
}

export default new UserOperation();
