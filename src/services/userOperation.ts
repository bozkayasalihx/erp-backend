import { appDataSource } from "../loaders";
import { User } from "../models";

class UserOperation {
    private get source() {
        return appDataSource;
    }

    get userRepo() {
        return this.source.getRepository(User);
    }
    public async insert(user: Partial<User>) {
        const newUser = this.userRepo.create(user);

        return this.userRepo.save(newUser);
    }

    public async update(user: Partial<User>) {
        return this.userRepo.save(user);
    }
    public async login(email: string, username?: string) {
        return this.userRepo.findOne({ where: [{ email }, { username }] });
    }

    public creatUser(params: Partial<User>) {
        return this.userRepo.create(params);
    }
}

export default new UserOperation();
