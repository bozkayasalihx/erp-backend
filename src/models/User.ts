import { AfterInsert, BeforeInsert, Column, Entity } from "typeorm";
import BaseEntity from "./BaseEntity";
import bcrypt from "bcryptjs";

@Entity("user")
export default class User extends BaseEntity {
    @BeforeInsert()
    private async beforeInsert() {
        this.password = await bcrypt.hash(this.password, +process.env.SALT!);
    }

    @AfterInsert()
    private afterInsert() {
        console.log("executing after insert or save");
    }

    @Column({ unique: true, nullable: true })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;
}
