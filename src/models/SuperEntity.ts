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
class SuperEntity extends BaseEntity {
    /** Base Entity */
    @PrimaryGeneratedColumn({ name: "id" })
    public id: number;

    @UpdateDateColumn({ name: "updated_at" })
    public updated_at: Date;

    @CreateDateColumn({ name: "created_at" })
    public created_at: Date;

    @Column({ default: null, name: "start_date", type: "date" })
    public start_date: Date;

    @Column({ default: null, name: "end_date", type: "date" })
    public end_date: Date;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "created_by" })
    public created_by: User;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "updated_by" })
    public updated_by: User;
}
export default SuperEntity;
