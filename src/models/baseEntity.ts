import {
    DataSource,
    DeepPartial,
    DeleteResult,
    EntityTarget,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    InsertResult,
    ObjectID,
    RemoveOptions,
    Repository,
    SaveOptions,
    SelectQueryBuilder,
    TableForeignKey,
    TableUnique,
    UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UpsertOptions } from "typeorm/repository/UpsertOptions";
import { ObjectUtils } from "../scripts/utils/ObjectUtils";
import { UserTypes } from "../types/types";

export class BaseEntity {
    private static dataSource: DataSource | null;

    hasId(): boolean {
        const baseEntity = this.constructor as typeof BaseEntity;
        return baseEntity.getRepository().hasId(this);
    }

    save(options?: SaveOptions): Promise<this> {
        const baseEntity = this.constructor as typeof BaseEntity;
        return baseEntity.getRepository().save(this, options);
    }

    remove(options?: RemoveOptions): Promise<this> {
        const baseEntity = this.constructor as typeof BaseEntity;
        return baseEntity
            .getRepository()
            .remove(this, options) as Promise<this>;
    }

    softRemove(options?: SaveOptions): Promise<this> {
        const baseEntity = this.constructor as typeof BaseEntity;
        return baseEntity.getRepository().softRemove(this, options);
    }

    recover(options?: SaveOptions): Promise<this> {
        const baseEntity = this.constructor as typeof BaseEntity;
        return baseEntity.getRepository().recover(this, options);
    }

    async reload(): Promise<void> {
        const baseEntity = this.constructor as typeof BaseEntity;
        const id = baseEntity.getRepository().metadata.getEntityIdMap(this);
        if (!id) {
            throw new Error(
                `Entity doesn't have id-s set, cannot reload entity`
            );
        }
        const reloadedEntity: BaseEntity = await baseEntity
            .getRepository()
            .findOneByOrFail(id);

        ObjectUtils.assign(this, reloadedEntity);
    }

    static useDataSource(dataSource: DataSource | null) {
        this.dataSource = dataSource;
    }

    static getRepository<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity
    ): Repository<T> {
        const dataSource = (this as typeof BaseEntity).dataSource;
        if (!dataSource)
            throw new Error(`DataSource is not set for this entity.`);
        return dataSource.getRepository<T>(this);
    }

    static get target(): EntityTarget<any> {
        return this.getRepository().target;
    }

    static hasId(entity: BaseEntity): boolean {
        return this.getRepository().hasId(entity);
    }

    static getId<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entity: T
    ): any {
        return this.getRepository<T>().getId(entity);
    }

    static createQueryBuilder<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        alias?: string
    ): SelectQueryBuilder<T> {
        return this.getRepository<T>().createQueryBuilder(alias);
    }

    static create<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity
    ): T;

    static create<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entityLikeArray: DeepPartial<T>[]
    ): T[];

    static create<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entityLike: DeepPartial<T>
    ): T;

    static create<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entityOrEntities?: any
    ) {
        return this.getRepository<T>().create(entityOrEntities);
    }

    static merge<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        mergeIntoEntity: T,
        ...entityLikes: DeepPartial<T>[]
    ): T {
        return this.getRepository<T>().merge(
            mergeIntoEntity,
            ...entityLikes
        ) as T;
    }

    static preload<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entityLike: DeepPartial<T>
    ): Promise<T | undefined> {
        const thisRepository = this.getRepository() as Repository<T>;
        return thisRepository.preload(entityLike);
    }

    static save<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entities: DeepPartial<T>[],
        options?: SaveOptions
    ): Promise<T[]>;

    static save<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entity: DeepPartial<T>,
        options?: SaveOptions
    ): Promise<T>;

    static save<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entityOrEntities: DeepPartial<T> | DeepPartial<T>[],
        options?: SaveOptions
    ) {
        return this.getRepository<T>().save(entityOrEntities as any, options);
    }

    static remove<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entities: T[],
        options?: RemoveOptions
    ): Promise<T[]>;

    static remove<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entity: T,
        options?: RemoveOptions
    ): Promise<T>;

    static remove<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entityOrEntities: T | T[],
        options?: RemoveOptions
    ) {
        return this.getRepository<T>().remove(entityOrEntities as any, options);
    }

    static softRemove<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entities: T[],
        options?: SaveOptions
    ): Promise<T[]>;

    static softRemove<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entity: T,
        options?: SaveOptions
    ): Promise<T>;

    static softRemove<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entityOrEntities: T | T[],
        options?: SaveOptions
    ) {
        return this.getRepository<T>().softRemove(
            entityOrEntities as any,
            options
        );
    }

    static insert<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entity: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]
    ): Promise<InsertResult> {
        return this.getRepository<T>().insert(entity);
    }

    static update<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        criteria:
            | string
            | string[]
            | number
            | number[]
            | Date
            | Date[]
            | ObjectID
            | ObjectID[]
            | FindOptionsWhere<T>,
        partialEntity: QueryDeepPartialEntity<T>
    ): Promise<UpdateResult> {
        return this.getRepository<T>().update(criteria, partialEntity);
    }

    static upsert<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        entityOrEntities:
            | QueryDeepPartialEntity<T>
            | QueryDeepPartialEntity<T>[],
        conflictPathsOrOptions: string[] | UpsertOptions<T>
    ): Promise<InsertResult> {
        return this.getRepository<T>().upsert(
            entityOrEntities,
            conflictPathsOrOptions
        );
    }

    static delete<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        criteria:
            | string
            | string[]
            | number
            | number[]
            | Date
            | Date[]
            | ObjectID
            | ObjectID[]
            | FindOptionsWhere<T>
    ): Promise<DeleteResult> {
        return this.getRepository<T>().delete(criteria);
    }

    static count<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        options?: FindManyOptions<T>
    ): Promise<number> {
        return this.getRepository<T>().count(options);
    }

    static countBy<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        where: FindOptionsWhere<T>
    ): Promise<number> {
        return this.getRepository<T>().countBy(where);
    }

    static find<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        options?: FindManyOptions<T>
    ): Promise<T[]> {
        return this.getRepository<T>().find(options);
    }

    static findBy<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        where: FindOptionsWhere<T>
    ): Promise<T[]> {
        return this.getRepository<T>().findBy(where);
    }

    static findAndCount<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        options?: FindManyOptions<T>
    ): Promise<[T[], number]> {
        return this.getRepository<T>().findAndCount(options);
    }

    static findAndCountBy<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        where: FindOptionsWhere<T>
    ): Promise<[T[], number]> {
        return this.getRepository<T>().findAndCountBy(where);
    }

    static async getChildType(userId: number) {
        const user: [{ id: number; user_type: UserTypes }] =
            await this.createQueryBuilder().connection.query(
                `SELECT id, user_type FROM user_tbl where id = ${userId}`
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

    static async getForeignKey(columnName: string) {
        const table = await this.getTable();
        let foreignkey: TableForeignKey | null = null;

        for (let i = 0; i < table.foreignKeys.length; i++) {
            if (table.foreignKeys[i].columnNames[0] === columnName) {
                foreignkey = table.foreignKeys[i];
                break;
            }
        }

        return foreignkey;
    }

    static async createUniqueContraint() {
        return new TableUnique({
            columnNames: ["ref_table_id"],
        });
    }
    static async removeUniqueContraint() {
        const table = await this.dataSource
            ?.createQueryRunner()
            .getTable("user_entity_relations");

        const maker = table?.foreignKeys.filter(
            ({ referencedTableName }) =>
                referencedTableName === "vendor" ||
                referencedTableName === "buyer_site" ||
                referencedTableName === "dealer_site"
        )[0];

        maker && table?.removeUniqueConstraint(maker);
    }

    static async createRelation(referedTable: string) {
        const foreignKey = new TableForeignKey({
            columnNames: ["ref_table_id"],
            referencedColumnNames: ["id"],
            referencedTableName: referedTable,
            onDelete: "CASCADE",
        });

        const table = await this.getTable();
        const constrait = await this.createUniqueContraint();
        this.dataSource
            ?.createQueryRunner()
            .createUniqueConstraint(table, constrait);

        // this.dataSource?.createQueryRunner().dropUniqueConstraint(table);
        await this.dataSource
            ?.createQueryRunner()
            .createForeignKey(table, foreignKey);
    }

    static async dropRelation(columnName: string) {
        const foreignKey = await this.getForeignKey(columnName);
        const table = await this.getTable();
        foreignKey && table.removeForeignKey(foreignKey);
    }

    static async getTable() {
        try {
            const table = await this.dataSource
                ?.createQueryRunner()
                .getTable("user_entity_relations");

            if (table) {
                return table;
            }
            throw new Error("entity not found!");
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    static async findOne<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        options: FindOneOptions<T>,
        userId?: number
    ): Promise<T | null> {
        let childType = 0;
        if (userId) {
            childType = await this.getChildType(userId);
        }

        if (childType === 2) {
            // dealer site;
            await this.removeUniqueContraint();
            // await this.createUniqueContraint();
            await this.dropRelation("ref_table_id");
            await this.createRelation("dealer_site");
        } else if (childType === 3) {
            // buyer site;
            await this.removeUniqueContraint();
            // await this.createUniqueContraint();
            await this.dropRelation("ref_table_id");
            await this.createRelation("buyer_site");
        }

        return this.getRepository<T>().findOne(options);
    }

    static findOneBy<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        where: FindOptionsWhere<T>
    ): Promise<T | null> {
        return this.getRepository<T>().findOneBy(where);
    }

    static findOneOrFail<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        options: FindOneOptions<T>
    ): Promise<T> {
        return this.getRepository<T>().findOneOrFail(options);
    }

    static findOneByOrFail<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        where: FindOptionsWhere<T>
    ): Promise<T> {
        return this.getRepository<T>().findOneByOrFail(where);
    }

    static query<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity,
        query: string,
        parameters?: any[]
    ): Promise<any> {
        return this.getRepository<T>().query(query, parameters);
    }

    static clear<T extends BaseEntity>(
        this: { new (): T } & typeof BaseEntity
    ): Promise<void> {
        return this.getRepository<T>().clear();
    }
}
