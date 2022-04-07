import { appDataSource } from "../loaders";
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
    public async login(email: string) {
        return this.userRepo.findOne({ where: { email } });
    }

    public creatUser(params: Partial<User>) {
        return this.userRepo.create(params);
    }
}

export default new UserOperation();
