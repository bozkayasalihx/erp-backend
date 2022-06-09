import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { MigrationInterface, QueryRunner } from "typeorm";
import { UserTypes } from "../types/types";

type ReturnType = { obj: Record<string, any>; tableName: string };

export class migrations1654676053160 implements MigrationInterface {
    private randomIndex() {
        const values = Object.values(UserTypes);
        const index = Math.floor(Math.random() * values.length);
        return values[index];
    }

    private hash() {
        const str = "google";
        return bcrypt.hash(str, +process.env.SALT);
    }

    private genKeys(obj: Record<string, any>) {
        let str = "(";
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            if (i == keys.length - 1) str += `${keys[i]}`;
            else str += `${keys[i]},`;
        }
        str += ")";

        return str;
    }

    private genValues(obj: Record<string, any>) {
        let str = "(";
        const values = Object.values(obj);
        for (let j = 0; j < values.length; j++) {
            if (j == values.length - 1) str += `'${values[j]}'`;
            else str += `'${values[j]}',`;
        }

        str += ")";
        return str;
    }

    private async runner(
        queryRunner: QueryRunner,
        callback: () => ReturnType | Promise<ReturnType>
    ) {
        for (let i = 1; i < 31; i++) {
            try {
                const { obj, tableName } = await callback();
                const obj1 = this.genKeys(obj);
                const obj2 = this.genValues(obj);

                await queryRunner.query(
                    `INSERT INTO ${tableName} ${obj1} VALUES ${obj2}`
                );
            } catch (err) {
                continue;
            }
        }
    }

    private async specificUserInsert(queryRunner: QueryRunner) {
        const specificUser = {
            username: "google",
            email: "google@google.com",
            password: await this.hash(),
            user_type: "SA",
            tckn: BigInt(faker.random.numeric(11)),
            mobile: faker.random.numeric(10),
            start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
            end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
        };

        const userColumns = this.genKeys(specificUser);
        const userValues = this.genValues(specificUser);
        await queryRunner.query(
            `INSERT INTO users ${userColumns} VALUES ${userValues}`
        );
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.runner(queryRunner, async () => {
            const randomUserType = this.randomIndex();

            // await this.specificUserInsert(queryRunner);
            const userObj = {
                username: faker.name.firstName(),
                email: faker.internet.email(),
                password: await this.hash(),
                user_type: randomUserType,
                tckn: BigInt(faker.random.numeric(11)),
                mobile: faker.random.numeric(10),
                start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
                end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
            };

            return {
                obj: userObj,
                tableName: "users",
            };
        });

        this.runner(queryRunner, async () => {
            const vendorObj = {
                name: faker.company.companyName(),
                tax_no: faker.random.alpha(20),
                start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
                end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
                attribute1: faker.lorem.slug(),
                updated_by: 1,
                created_by: 1,
            };

            return {
                obj: vendorObj,
                tableName: "vendors",
            };
        });

        let i = 1;
        this.runner(queryRunner, () => {
            const vendorRegionObj = {
                name: faker.company.companyName(),
                attribute1: faker.lorem.slug(),
                vendor_id: i++,
                created_by: 1,
                updated_by: 1,
            };

            return {
                obj: vendorRegionObj,
                tableName: "vendor_regions",
            };
        });

        i = 1;

        this.runner(queryRunner, () => {
            const dealerObj = {
                name: faker.company.companyName(),
                tax_no: faker.random.alpha(20),
                start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
                end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
                created_by: 1,
                updated_by: 1,
            };

            return {
                obj: dealerObj,
                tableName: "dealers",
            };
        });

        let h = 1;
        this.runner(queryRunner, () => {
            const dalerSiteObj = {
                name: faker.company.companyName(),
                start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
                end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
                created_by: 1,
                updated_by: 1,
                // dealer_id: Math.floor(Math.random() * 30),
                dealer_id: h++,
            };
            return {
                obj: dalerSiteObj,
                tableName: "dealer_sites",
            };
        });
        h = 1;

        this.runner(queryRunner, () => {
            const buyerObj = {
                name: faker.name.firstName(),
                tax_no: faker.random.alpha(20),
                start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
                end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
                created_by: 1,
                updated_by: 1,
            };
            return {
                obj: buyerObj,
                tableName: "buyers",
            };
        });
        let m = 1;
        this.runner(queryRunner, () => {
            const buyerSiteObj = {
                name: faker.name.firstName(),
                start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
                end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
                created_by: 1,
                updated_by: 1,
                buyer_id: m++,
            };
            return {
                obj: buyerSiteObj,
                tableName: "buyer_sites",
            };
        });
        m = 1;

        this.runner(queryRunner, () => {
            const userEntity = {
                user_id: Math.floor(Math.random() * 30),
                description: faker.lorem.sentence(4),
                start_date: dayjs(faker.date.recent()).format("MM/DD/YYYY"),
                end_date: dayjs(faker.date.future()).format("MM/DD/YYYY"),
                created_by: 1,
                updated_by: 1,
            };

            return {
                obj: userEntity,
                tableName: "user_entity_relations",
            };
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //
    }
}
