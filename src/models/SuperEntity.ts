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

export default class SuperEntity extends BaseEntity {
    /** Base Entity */
    @PrimaryGeneratedColumn({ name: "id" })
    public id: number;

    @UpdateDateColumn({ name: "updated_at" })
    public updated_at: Date;

    @CreateDateColumn({ name: "created_at" })
    public created_at: Date;

    @Column({ default: null, name: "start_date" })
    public start_date: Date;

    @Column({ default: null, name: "end_date" })
    public end_date: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: "created_by" })
    public created_by: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "updated_by" })
    public updated_by: number;
}
