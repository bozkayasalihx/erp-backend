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
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deleted_at: Date;

    @Column({ default: null, name: "start_date" })
    start_date: Date;

    @Column({ default: null, name: "end_date" })
    end_date: Date;

    @OneToOne(() => User)
    @JoinColumn({ name: "created_by" })
    created_by: number;

    @OneToOne(() => User)
    @JoinColumn({ name: "updated_by" })
    updated_by: number;
}
