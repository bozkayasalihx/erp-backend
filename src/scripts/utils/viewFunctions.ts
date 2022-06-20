import { SelectQueryBuilder } from "typeorm";
import { appDataSource } from "../../loaders";
import { UserEntityAccessV } from "../../models";
import { SqlConditions } from "../../types/types";

// onlyActives = {true: just active records, false: all records}
/**
 * @date_fields: should be 'DD.MM.YYYY' string format
 * @onlyActives: {true: just active records, false: all records}
 */
export async function execUserEntityAccess(
    params: SqlConditions,
    onlyActives: boolean
) {
    let builder = appDataSource.manager
        .createQueryBuilder(UserEntityAccessV, "uea")
        .where("1=1");

    for (const [key, value] of Object.entries(params)) {
        builder = builder.andWhere(`"uea"."${key}" = :${key}`, {
            [key]: value,
        });
    }

    if (onlyActives) {
        builder = setActiveConditions(builder);
    }

    const resultSet = await builder.getMany();

    return resultSet;
}

// specifically designed for UserEntityAccessV model
export function setActiveConditions(
    builder: SelectQueryBuilder<UserEntityAccessV>
) {
    builder = builder.andWhere(
        `coalesce("uea"."start_date_uer",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."end_date_uer",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."start_date_user",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."end_date_user",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."start_date_vdsbs",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."end_date_vdsbs",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."start_date_vds",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."end_date_vds",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."start_date_vendor",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."end_date_vendor",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."start_date_ds",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."end_date_ds",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."start_date_dealer",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."end_date_dealer",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."start_date_bs",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."end_date_bs",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."start_date_buyer",current_date) between current_date-1 and current_date+1`
    );
    builder = builder.andWhere(
        `coalesce("uea"."end_date_buyer",current_date) between current_date-1 and current_date+1`
    );

    return builder;
}
