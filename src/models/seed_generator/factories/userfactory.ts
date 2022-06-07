import { faker } from "@faker-js/faker";
import UserEntityRelation from "models/UserEntityRelation";
import { define } from "typeorm-seeding";
import { UserTypes } from "types/types";
import User from "../../User";

function random() {
    const index = Math.floor(Math.random() * 6);
    return Object.values(UserTypes)[index];
}

define(User, (fack: typeof faker) => {
    const user = new User();
    user.username = fack.name.firstName();
    user.email = fack.internet.email();
    user.password = fack.internet.password();
    user.user_type = random();
    user.tckn = BigInt(fack.random.numeric(11));
    user.mobile = fack.phone.phoneNumber();
    user.start_date = fack.date.recent();
    user.end_date = fack.date.future();

    return user;
});

define(UserEntityRelation, (fack: typeof faker) => {
    const userentity = new UserEntityRelation();
    userentity.description = fack.lorem.paragraph();
    return userentity;
});
