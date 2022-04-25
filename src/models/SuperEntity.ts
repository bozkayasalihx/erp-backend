import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { userOperation } from "../services";
import { UserTypes } from "../types/types";
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

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "created_by" })
    public created_by: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "updated_by" })
    public updated_by: number;

    // events

    @BeforeInsert()
    private async beforeInsert() {
        let user: User | null = null;
        if (!this.updated_by || !this.created_by) {
            try {
                user = await userOperation.userRepo.findOne({
                    where: { username: "super user" },
                });
            } catch (err) {
                const u = userOperation.creatUser({
                    username: "super user",
                    email: "test@test.com",
                    mobile: "11213213213",
                    tckn: BigInt(92139343794),
                    user_type: UserTypes.VENDOR_ADMIN,
                    tokenVersion: 0,
                });

                user = await u.save();
            }

            this.created_by = user?.id as number;
            this.updated_by = user?.id as number;
        }
    }
}
