import bcrypt from "bcryptjs";
import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserTypes } from "../types/types";

@Entity("users")
export default class User extends BaseEntity {
    /** Properties */
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

    @Column({ unique: true, nullable: true, name: "username" })
    public username: string;

    @Column({ unique: true, nullable: false, name: "email" })
    public email: string;

    @Column({ nullable: false, name: "password" })
    public password: string;

    @Column({
        type: "enum",
        enum: UserTypes,
        default: UserTypes.SITE_ADMIN,
        name: "user_type",
    })
    @Index("user_type")
    public user_type: UserTypes;

    @Column({ unique: true, type: "bigint", name: "tckn" })
    public tckn: BigInt;

    @Column({ unique: true, type: "varchar", length: 20, name: "mobile" })
    public mobile: string;

    @Column("int", { default: 0 })
    public tokenVersion: number;

    /** before insert operations */
    @BeforeInsert()
    private async beforeInsert() {
        this.password = await bcrypt.hash(this.password, +process.env.SALT);
    }
}
