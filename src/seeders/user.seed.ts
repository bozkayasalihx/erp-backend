import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { DataSource } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { User } from "../models";

export default class CreateUsers implements Seeder {
    public async run(factory: Factory, datasource: DataSource): Promise<any> {
        const salt = 10;
        await datasource
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
                {
                    username: faker.name.firstName(),
                    email: faker.internet.email(),
                    password: "google",
                    //@ts-ignore
                    user_type: "SA",
                    tckn: BigInt(faker.random.numeric(11)),
                    mobile: faker.random.numeric(10),
                    start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
                    end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
                },
            ])
            .execute();
    }
}
