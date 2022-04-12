import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from "typeorm";
import User from "./User";

export default abstract class BaseEntity {
    /** Base Entity */
    @PrimaryGeneratedColumn()
    id: number;

    @UpdateDateColumn()
    update_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @Column({ default: null })
    start_date: Date;

    @Column({ default: null })
    end_date: Date;

    @OneToOne(() => User)
    created_user: User;

    @OneToOne(() => User)
    updated_user: User;

    @RelationId((CE: BaseEntity) => CE.created_user)
    @Column()
    created_by: number;

    @RelationId((CE: BaseEntity) => CE.updated_user)
    @Column()
    updated_by: number;
}
