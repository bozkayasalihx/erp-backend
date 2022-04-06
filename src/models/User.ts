import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import BaseEntity from "./BaseEntity";

@Entity("user")
export default class User extends BaseEntity {
    @Column({ unique: true })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;
}
