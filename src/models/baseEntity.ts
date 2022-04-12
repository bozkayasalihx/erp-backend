import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    JoinColumn,
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
    @JoinColumn({ name: "created_by" })
    created_by: number;

    @OneToOne(() => User)
    @JoinColumn({ name: "updated_by" })
    updated_by: number;
}
