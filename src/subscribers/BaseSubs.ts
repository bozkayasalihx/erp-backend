import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    Table,
} from "typeorm";
import { appDataSource } from "../loaders";
import UserEntityRelation from "../models/UserEntityRelation";
import { UserTypes } from "../types/types";

interface ITableOptions {
    tableName: string;
    refTableName: string;
}

@EventSubscriber()
export class UserEntityRelationSubscriber
    implements EntitySubscriberInterface<UserEntityRelation>
{
    private subsribers = appDataSource.subscribers;
    private entity: UserEntityRelation;
    private manager = appDataSource.manager;

    constructor() {
        this.subsribers.push(this);
    }

    listenTo() {
        return UserEntityRelation;
    }

    async beforeInsert(event: InsertEvent<UserEntityRelation>) {
        this.entity = event.entity;

        const childType = await this.getChildType();

        const valid = await event.queryRunner.hasColumn(
            "user_entity_relation",
            "ref_table_id"
        );

        if (valid) {
            await event.queryRunner.dropTable(
                "user_entity_relation",
                true,
                true,
                true
            );

            if (childType === 1) {
                // vendor
                await event.queryRunner.createTable(
                    this.genTable({
                        tableName: "user_entity_relation",
                        refTableName: "vendor",
                    })
                );
            } else if (childType === 2) {
                // dealer
                await event.queryRunner.createTable(
                    this.genTable({
                        tableName: "user_entity_relation",
                        refTableName: "dealer_site",
                    })
                );
            } else if (childType === 3) {
                // buyer
                await event.queryRunner.createTable(
                    this.genTable({
                        tableName: "user_entity_relation",
                        refTableName: "buyer_site",
                    })
                );
            }
        }
    }

    private genTable({ tableName, refTableName }: ITableOptions) {
        return new Table({
            name: tableName,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "NOW()",
                    onUpdate: "NOW()",
                },

                {
                    name: "created_at",
                    type: "timestamp",
                    default: "NOW()",
                },
                {
                    name: "start_date",
                    isNullable: true,
                    default: null,
                    type: "timestamp",
                },
                {
                    name: "end_date",
                    isNullable: true,
                    default: null,
                    type: "timestamp",
                },
                {
                    name: "description",
                    type: "varchar",
                    length: "240",
                    default: null,
                },
                {
                    name: "created_by",
                    type: "int",
                },

                {
                    name: "updated_by",
                    type: "int",
                },

                {
                    name: "ref_table_id",
                    type: "int",
                },
                {
                    name: "user_id",
                    type: "int",
                },
            ],
            foreignKeys: [
                {
                    name: "ref_table",
                    referencedTableName: refTableName,
                    referencedColumnNames: ["id"],
                    columnNames: ["ref_table_id"],
                },
                {
                    name: "created_by",
                    referencedTableName: "user_tbl",
                    referencedColumnNames: ["id"],
                    columnNames: ["created_by"],
                },
                {
                    name: "updated_by",
                    referencedTableName: "user_tbl",
                    referencedColumnNames: ["id"],
                    columnNames: ["updated_by"],
                },
                {
                    name: "users",
                    referencedTableName: "user_tbl",
                    referencedColumnNames: ["id"],
                    columnNames: ["user_id"],
                },
            ],
        });
    }

    private async getChildType() {
        const user: [{ id: number; user_type: UserTypes }] =
            await this.manager.query(
                `SELECT id, user_type FROM user_tbl where id = ${this.entity.users.id}`
            );
        if (!user) throw new Error("no such as user");
        return user[0].user_type === UserTypes.VENDOR ||
            user[0].user_type === UserTypes.VENDOR_ADMIN
            ? 1
            : user[0].user_type === UserTypes.BUYER ||
              user[0].user_type === UserTypes.BUYER_ADMIN
            ? 3
            : user[0].user_type === UserTypes.DEALER ||
              user[0].user_type === UserTypes.DEALER_ADMIN
            ? 2
            : 0;
    }

    // afterLoad(
    //     entity: UserEntityRelation,
    //     event: LoadEvent<UserEntityRelation>
    // ) {
    //     console.log("entity", entity);
    // }
}
