import { appDataSource } from "../configs";
import { User } from "../models";

class UserOperation {
    private get userRepo() {
        return appDataSource.getRepository(User);
    }
    public async insert(user: Partial<User>) {
        const newUser = this.userRepo.create(user);

        return this.userRepo.save(newUser);
    }

    public async update(user: Partial<User>) {
        return this.userRepo.save(user);
    }
}

export default new UserOperation();
