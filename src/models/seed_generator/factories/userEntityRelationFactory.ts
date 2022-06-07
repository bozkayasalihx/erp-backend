import { faker } from "@faker-js/faker";
import { define } from "typeorm-seeding";
import UserEntityRelation from "../../UserEntityRelation";

define(UserEntityRelation, (fack: typeof faker) => {
    const userEntity = new UserEntityRelation();
    userEntity.start_date = fack.date.recent();
    userEntity.end_date = fack.date.future();
    userEntity.description = fack.lorem.words(2);
    return userEntity;
});
