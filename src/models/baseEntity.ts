import {
    BaseEntity,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import User from "./User";

export default abstract class SuperEntity extends BaseEntity {
    /** Base Entity */
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @Column({ default: null, name: "start_date" })
    start_date: Date;

    @Column({ default: null, name: "end_date" })
    end_date: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: "created_by" })
    created_by: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "updated_by" })
    updated_by: number;
}
