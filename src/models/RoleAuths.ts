import { UserTypes } from "../types/types";
import { Column, Entity, Index } from "typeorm";
import BaseEntity from "./BaseEntity";

@Entity("role_auth")
@Index(["role_name", "route_name", "route_method"])
export default class RoleAuth extends BaseEntity {
    @Column({ type: "enum", enum: UserTypes })
    role_name: UserTypes;

    @Column({ type: "varchar", length: 100 })
    route_name: string;

    @Column({ array: true, type: "varchar" })
    route_method: Array<string>;
}
