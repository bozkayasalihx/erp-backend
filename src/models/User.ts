import bcrypt from "bcryptjs";
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserTypes } from "../types/types";
import UserEntityRelation from "./UserEntityRelation";

@Entity("user_tbl")
export default class User {
    /** Properties */
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @UpdateDateColumn({ name: "udpated_at" })
    updated_at: Date;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deleted_at: Date;

    @Column({ default: null, name: "start_date" })
    start_date: Date;

    @Column({ default: null, name: "end_date" })
    end_date: Date;

    @Column({ unique: true, nullable: true, name: "username" })
    username: string;

    @Column({ unique: true, nullable: false, name: "email" })
    email: string;

    @Column({ nullable: false, name: "password" })
    password: string;

    @Column({
        type: "enum",
        enum: UserTypes,
        default: UserTypes.VENDOR_ADMIN,
        name: "user_type",
    })
    user_type: UserTypes;

    @Column({ type: "bigint", name: "tckn" })
    tckn: BigInt;

    @Column({ type: "varchar", length: 20, name: "mobile" })
    mobile: string;

    /** before insert operations */
    @BeforeInsert()
    private async beforeInsert() {
        this.password = await bcrypt.hash(this.password, +process.env.SALT!);
    }
}
