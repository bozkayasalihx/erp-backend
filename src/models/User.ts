import bcrypt from "bcryptjs";
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserTypes } from "../types/types";

@Entity("user")
export default class User {
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

    @Column({ unique: true, nullable: true })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ type: "enum", enum: UserTypes, default: UserTypes.VENDOR })
    user_type: UserTypes;

    @Column({ type: "bigint" })
    tckn: BigInt;

    @Column({ type: "varchar", length: 20 })
    mobile: string;

    @BeforeInsert()
    private async beforeInsert() {
        this.password = await bcrypt.hash(this.password, +process.env.SALT!);
    }
}
